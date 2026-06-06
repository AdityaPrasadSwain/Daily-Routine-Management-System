import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../api/axiosConfig';

export const AlarmContext = createContext();

export const AlarmProvider = ({ children }) => {
    const [alarms, setAlarms] = useState([]);
    const [ringingAlarm, setRingingAlarm] = useState(null);
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const gainNodeRef = useRef(null);
    const [user, setUser] = useState(null);

    // Load User ID for WebSocket subscription
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me');
                setUser(response.data);
            } catch (error) {
                console.error("Failed to load user for alarms:", error);
            }
        };
        if (localStorage.getItem('token')) {
            fetchUser();
        }
    }, []);

    // WebSocket Connection
    useEffect(() => {
        if (!user) return;

        const socket = new SockJS('http://localhost:8083/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log('Connected to WebSocket for Alarms');
                stompClient.subscribe(`/topic/alarms/${user.id}`, (message) => {
                    const alarmEvent = JSON.parse(message.body);
                    triggerAlarm(alarmEvent);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [user]);

    // Initialize Web Audio API
    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.connect(audioContextRef.current.destination);
        }
    };

    const playSound = async (soundName = 'default', loop = true) => {
        initAudio();
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        stopSound(); // Stop any currently playing sound

        try {
            // Create distinct sounds for each type using Web Audio API
            const osc = audioContextRef.current.createOscillator();

            switch (soundName) {
                case 'beep':
                    // High-pitched square wave beep
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
                    break;

                case 'bell':
                    // Bell-like sine wave with higher frequency
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523, audioContextRef.current.currentTime);
                    // Add slight vibrato for bell effect
                    const lfo = audioContextRef.current.createOscillator();
                    const lfoGain = audioContextRef.current.createGain();
                    lfo.frequency.value = 5;
                    lfoGain.gain.value = 10;
                    lfo.connect(lfoGain);
                    lfoGain.connect(osc.frequency);
                    lfo.start();
                    break;

                case 'digital':
                    // Digital alarm with frequency modulation
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
                    // Create pulsing effect
                    gainNodeRef.current.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
                    gainNodeRef.current.gain.linearRampToValueAtTime(1, audioContextRef.current.currentTime + 0.1);
                    gainNodeRef.current.gain.linearRampToValueAtTime(0.5, audioContextRef.current.currentTime + 0.2);
                    break;

                case 'siren':
                    // Siren with sweeping frequency
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
                    osc.frequency.linearRampToValueAtTime(880, audioContextRef.current.currentTime + 1);
                    osc.frequency.linearRampToValueAtTime(440, audioContextRef.current.currentTime + 2);
                    break;

                case 'default':
                default:
                    // Standard alarm tone
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
                    break;
            }

            osc.connect(gainNodeRef.current);
            osc.start();
            sourceNodeRef.current = osc;

            // For looping sounds, restart after they complete
            if (loop && soundName !== 'default') {
                osc.onended = () => {
                    if (sourceNodeRef.current) {
                        playSound(soundName, loop);
                    }
                };
                // Set duration based on sound type
                const duration = soundName === 'siren' ? 2 : 0.5;
                osc.stop(audioContextRef.current.currentTime + duration);
            }

        } catch (e) {
            console.error("Error playing sound", e);
        }
    };

    const stopSound = () => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
                sourceNodeRef.current.disconnect();
            } catch (e) { }
            sourceNodeRef.current = null;
        }
    };

    const triggerAlarm = (alarm) => {
        setRingingAlarm(alarm);
        // Use alarmSound field with fallback to 'default' for backward compatibility
        const soundToPlay = alarm.alarmSound || alarm.sound || 'default';
        playSound(soundToPlay, true);
    };

    const dismissAlarm = () => {
        stopSound();
        setRingingAlarm(null);
    };

    const snoozeAlarm = () => {
        stopSound();
        setRingingAlarm(null);
        // Call backend to snooze (optional implementation)
    };

    return (
        <AlarmContext.Provider value={{
            ringingAlarm,
            dismissAlarm,
            snoozeAlarm,
            playSound,
            stopSound
        }}>
            {children}
        </AlarmContext.Provider>
    );
};
