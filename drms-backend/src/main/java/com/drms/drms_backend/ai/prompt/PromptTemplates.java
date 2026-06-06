package com.drms.drms_backend.ai.prompt;

/**
 * Centralized prompt templates for AI features
 * All prompts are designed to return JSON responses for easy parsing
 */
public class PromptTemplates {

  // ========== AI GOAL ASSISTANT ==========

  public static final String GOAL_SUGGESTION_PROMPT = """
      You are a productivity coach helping users set better goals.

      User's Goal:
      Title: {title}
      Description: {description}

      Provide:
      1. An improved, more specific goal description (2-3 sentences)
      2. A suggested breakdown of this goal into 3-5 actionable steps
      3. Recommended duration type (DAILY, WEEKLY, MONTHLY, or LONG_TERM)
      4. Brief explanation of why this duration makes sense

      Format your response as JSON:
      {{
        "improvedTitle": "...",
        "improvedDescription": "...",
        "subGoals": ["step 1", "step 2", "step 3"],
        "suggestedDuration": "WEEKLY",
        "durationReason": "..."
      }}

      Keep it concise and actionable.
      """;

  // ========== AI TASK BREAKDOWN ==========

  public static final String TASK_BREAKDOWN_PROMPT = """
      You are a task management expert helping users break down goals into tasks.

      Goal: {goalTitle}
      Deadline: {deadline}

      Create a list of 4-7 specific, actionable tasks to achieve this goal.
      For each task, provide:
      - Task title (clear and actionable)
      - Priority (HIGH, MEDIUM, LOW)
      - Estimated duration in minutes

      Format as JSON:
      {{
        "tasks": [
          {{
            "title": "...",
            "priority": "HIGH",
            "estimatedMinutes": 30
          }},
          ...
        ]
      }}

      Ensure tasks are ordered logically (dependencies first).
      """;

  // ========== AI DAILY REVIEW ==========

  public static final String DAILY_REVIEW_PROMPT = """
      You are a motivational productivity coach reviewing someone's day.

      Today's Performance:
      - Completed Tasks: {completedTasks}
      - Missed Tasks: {missedTasks}
      - Total Tasks: {totalTasks}

      Provide:
      1. A short motivational summary (2-3 sentences, encouraging tone)
      2. Productivity score (0-100, be realistic but positive)
      3. ONE specific improvement suggestion for tomorrow

      Format as JSON:
      {{
        "summary": "...",
        "productivityScore": 75,
        "suggestion": "..."
      }}

      Be encouraging but honest. Focus on progress, not perfection.
      """;

  // ========== AI ALARM MESSAGE ==========

  public static final String ALARM_MESSAGE_PROMPT = """
      You are creating a friendly, motivational alarm message.

      Context:
      - Task: {taskTitle}
      - Time: {time}
      - Type: {alarmType}

      Create a short, friendly alarm message (1-2 sentences) that:
      - Is motivational and positive
      - Mentions the task naturally
      - Feels personal, not robotic
      - Is appropriate for the time of day

      Format as JSON:
      {{
        "message": "..."
      }}

      Examples:
      - Morning: "Good morning! Time to tackle {task}. You've got this!"
      - Evening: "Hey! Don't forget about {task} before bed. Quick and easy!"
      """;

  // ========== AI ROUTINE COACH ==========
  public static final String ROUTINE_COACH_PROMPT = """
      You are an elite productivity coach analyzing a user's routine history.

      History (Last 30 Days):
      - Completed Tasks: {completedCount}
      - Missed Tasks: {missedCount}
      - Avg Productivity Score: {avgScore}
      - Most Productive Time: {activeHours}

      Provide:
      1. Identification of productivity patterns (positive & negative)
      2. Determination of their biological peak hours
      3. ONE high-impact advice to improve their routine

      Format as JSON. Respond ONLY with the JSON:
      {{
        "patterns": ["pattern 1", "pattern 2"],
        "bestHours": "09:00 - 11:00",
        "advice": "..."
      }}
      """;

  // ========== TOP 3 TASKS (DECISION FATIGUE) ==========
  public static final String TOP_3_TASKS_PROMPT = """
      Select exactly 3 most critical tasks from this list to focus on today.
      Ignore low priority if high priority exists.

      Tasks:
      {tasksList}

      Format as JSON. Respond ONLY with the JSON:
      {{
        "top3Tasks": [
          {{ "id": "task_id", "reason": "why this was chosen" }},
          ...
        ]
      }}
      """;

  // ========== ENERGY BASED PLANNER ==========
  public static final String ENERGY_PLAN_PROMPT = """
      Map these tasks to time slots based on the user's energy level: {energyLevel} (MORNING/AFTERNOON/EVENING peak).
      High focus tasks should go to peak times.

      Tasks:
      {tasksList}

      Format as JSON. Respond ONLY with the JSON:
      {{
        "schedule": [
          {{ "taskId": "...", "suggestedTime": "HH:MM", "reason": "..." }}
        ]
      }}
      """;

  // ========== BURNOUT PREDICTOR ==========
  public static final String BURNOUT_PREDICTOR_PROMPT = """
      Analyze burnout risk based on recent data.

      Data:
      - Missed Alarms (Last 7 days): {missedAlarms}
      - Missed Tasks (Last 7 days): {missedTasks}
      - Average Mood (1-10): {avgMood}

      Determine risk level (LOW, MEDIUM, HIGH).

      Format as JSON. Respond ONLY with the JSON:
      {{
        "riskLevel": "MEDIUM",
        "suggestion": "...",
        "recoveryMode": false
      }}
      """;

  // ========== LIFE BALANCE ==========
  public static final String LIFE_BALANCE_PROMPT = """
      Analyze the balance of life categories based on task distribution.

      Distribution:
      {categoryDistribution}

      Provide analysis and whether this is healthy.

      Format as JSON. Respond ONLY with the JSON:
      {{
        "analysis": "...",
        "balanced": true
      }}
      """;

  // ========== SMART SILENCE ==========
  public static final String SMART_SILENCE_PROMPT = """
      Decide if alarm intensity should be reduced based on recent behavior.
      User has missed {missedCount} recent alarms.

      Format as JSON. Respond ONLY with the JSON:
      {{
        "suggestion": "Keep normal" or "Switch to gentle/silent",
        "allowSilence": false
      }}
      """;

  // ========== DAILY REFLECTION ==========
  public static final String REFLECTION_QUESTION_PROMPT = """
      Generate ONE deep, introspective question for the user based on their recent focus: {recentFocus}.
      Make it philosophical but actionable.

      Format as JSON. Respond ONLY with the JSON:
      {{
        "question": "..."
      }}
      """;

  // ========== MINIMALIST MODE ==========
  public static final String MINIMALIST_MODE_PROMPT = """
      Determine if user needs Minimalist Mode (reduced UI).
      Current Load: {pendingCount} tasks.
      Recent Completion Rate: {completionRate}%.

      If load is high (>10) and completion low (<50%), activate it.

      Format as JSON. Respond ONLY with the JSON:
      {{
        "minimalistMode": true,
        "focusTasks": ["id1", "id2"]
      }}
      """;

  // ========== SOCIAL MEDIA DETOX ==========

  public static final String SOCIAL_LOG_INSIGHT_PROMPT = """
      User spent {minutes} mins on social media.
      Mood before: {moodBefore}. Mood after: {moodAfter}.
      Productivity impact (1-10): {impact}.
      Current Mode: {mode}.

      Analyze the hidden cost of this session.
      Adopt the following tone based on mode:
      - SOFT_CONTROL: Gentle, encouraging.
      - STRONG_DISCIPLINE: Strict, direct, no-nonsense.
      - AI_PSYCHOLOGY: Analytic, questioning deep motives.
      - STUDENT_FOCUS: Remind about academic goals.
      - SOCIAL_DETOX: minimalist, encourage offline time.

      Give one insight (max 2 sentences).
      Do NOT return JSON. Return plain text.
      """;

  public static final String SOCIAL_REPLACEMENT_TASK_PROMPT = """
      User wants to scroll social media because they feel {trigger}.
      Current Mode: {mode}.

      Suggest ONE specific, 2-5 minute productive micro-task.
      Adopt the tone: {mode}.

      Keep it simple and actionable.
      Start immediately with the task. No preamble.
      Do NOT return JSON. Return plain text.
      """;

  public static final String SOCIAL_TRIGGER_ANALYSIS_PROMPT = """
      Analyze this trigger for social media usage: {trigger}.
      Explain in 1 sentence why the brain seeks this.
      Suggest a healthier alternative source of dopamine.

      Format as JSON:
      {{
        "insight": "..."
      }}
      """;

  // ========== AI PRODUCTIVITY & IDENTITY ==========

  public static final String IDENTITY_CONTEXT_BASE = """
      User Identity Archetype: {identity}.
      Align your tone and advice with this archetype.
      - ESSENTIALIST: Focus on less but better, cutting noise.
      - HIGH_ACHIEVER: Push for excellence, speed, and results.
      - ZEN_MASTER: Focus on flow, mindfulness, and balance.
      - BALANCED_BUILDER: Focus on sustainable growth and consistency.
      """;

  public static final String FOCUS_SCORE_ANALYSIS_PROMPT = """
      Analyze the user's daily focus.
      Score: {score}/100.
      Social Usage: {socialMinutes} mins.

      """ + IDENTITY_CONTEXT_BASE + """

      Provide a 1-sentence insight explaining the score and offering a specific micro-habit to improve confidence.
      """;

  public static final String MENTAL_LOAD_ANALYSIS_PROMPT = """
      Analyze the user's mental load.
      Pending Tasks: {pendingTasks}.
      Urgent Alarms: {urgentAlarms}.
      Social Drain: {socialDrain} mins.

      """ + IDENTITY_CONTEXT_BASE + """

      Limit response to 2 sentences.
      1. State the current load status (Low/Medium/High/Overload).
      2. Suggest one immediate action to reduce load.

      Format as JSON:
      {{
        "status": "...",
        "suggestion": "..."
      }}
      """;

  public static final String ROUTINE_OPTIMIZER_PROMPT = """
      Analyze the last 7 days of routine data.
      Avg Focus Score: {avgScore}.
      Most missed task: {missedTask}.

      """ + IDENTITY_CONTEXT_BASE + """

      Suggest 3 specific optimizations to the routine.

      Format as JSON:
      {{
        "suggestions": ["...", "...", "..."]
      }}
      """;

  /**
   * Replace placeholders in prompt template
   */
  public static String fillTemplate(String template, Object... replacements) {
    String result = template;
    for (int i = 0; i < replacements.length; i += 2) {
      String placeholder = "{" + replacements[i] + "}";
      String value = String.valueOf(replacements[i + 1]);
      result = result.replace(placeholder, value);
    }
    return result;
  }
}
