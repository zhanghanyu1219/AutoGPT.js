import { CommandPlugins } from '../commandPlugins';
import { ResponseSchema } from './types';

const promptStart =
  "Your decisions must always be made independently without seeking user assistance. Play to your strengths as an LLM and pursue simple strategies with no legal complications.";

export function generatePrompt(
  aiName: string,
  aiRole: string,
  goals: string[],
  responseSchema: ResponseSchema = "JSON"
): string {
  return `You are ${aiName}, ${aiRole}\n${promptStart}\n\nGOALS:\n\n${goals.join(
    "\n"
  )}\n\n${generateBasePrompt(responseSchema)}`;
}

function generateBasePrompt(responseSchema: ResponseSchema) {
  const commandsStr = CommandPlugins.map((commandPlugin, index) => {
    const argsStr = Object.entries(commandPlugin.arguments)
      .map(([key, val]) => `"${key}": "<${val}>"`)
      .join(", ");
    return `${index + 1}. ${commandPlugin.name}: "${
      commandPlugin.command
    }", args: ${argsStr === "" ? `""` : argsStr}`;
  }).join("\n");

  return `
CONSTRAINTS:

1. ~4000 word limit for memory. Your memory is short, so immediately save important information to long term memory and code to files.
2. No user assistance

COMMANDS:

${commandsStr}

RESOURCES:

1. Long Term memory management.
2. GPT-3.5 powered Agents for delegation of simple tasks.
3. File output.
4. Browse the internet.

PERFORMANCE EVALUATION:

1. Continuously review and analyze your actions to ensure you are performing to the best of your abilities. 
2. Constructively self-criticize your big-picture behavior constantly.
3. Reflect on past decisions and strategies to refine your approach.
4. Every command has a cost, so be smart and efficient. Aim to complete tasks in the least number of steps.

You should only respond in ${responseSchema} format as described below without any other commentary

RESPONSE FORMAT:
${responseSchema === "JSON" ? JSON_SCHEMA : YAML_SCHEMA}

Ensure the response can be parsed by JavaScript ${
    responseSchema === "JSON" ? "JSON.parse" : "YAML parser"
  }`;
}

export const JSON_SCHEMA = `
{
  "command": {
      "name": "command name",
      "args":{
          "arg name": "value"
      }
  },
  "thoughts":
  {
      "text": "thought",
      "reasoning": "reasoning",
      "plan": "- short bulleted\n- list that conveys\n- long-term plan",
      "criticism": "constructive self-criticism",
      "speak": "thoughts summary to say to user"
  }
}`;

export const YAML_SCHEMA = `
command:
  name: command name
  args:
    arg name: value
thoughts:
  text: thought
  reasoning: reasoning
  plan: |
    - short bulleted
    - list that conveys
    - long-term plan
  criticism: constructive self-criticism
`;
