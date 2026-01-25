// Generate blog placeholder images using Gemini API
// Run: GEMINI_API_KEY=your_key npx tsx scripts/generate-blog-images.ts

import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../public/images/blog');

const BLOG_IMAGES = [
  {
    filename: 'ai-projects-fail',
    prompt: `Create a dark futuristic tech illustration for a blog about AI project failures.
Show a broken or glitching neural network visualization with warning symbols and error indicators.
Color scheme: dark blue/black background (#0a1628) with cyan (#00f0ff) and red (#ff6b6b) accents.
Include abstract representations of failed connections and disrupted data flows.
Style: minimalist, corporate tech, clean lines, no text.
Aspect ratio 16:9, high quality.`,
  },
  {
    filename: 'bicaraai-build',
    prompt: `Create a modern tech illustration for a case study about building an AI chatbot platform called BicaraAI.
Show abstract chat bubbles connected by neural network lines, with code bracket symbols and conversation flows.
Color scheme: dark background (#0a1628) with cyan (#00f0ff) and purple (#7c3aed) gradients.
Include subtle circuit patterns and AI brain visualization.
Style: sleek, futuristic, SaaS product marketing, no text.
Aspect ratio 16:9, high quality.`,
  },
  {
    filename: 'ai-roi',
    prompt: `Create a business analytics illustration about AI return on investment and realistic expectations.
Show an upward trending bar chart or growth graph with abstract dollar symbols and data visualizations.
Color scheme: dark blue background (#0a1628) with cyan (#00f0ff) and green (#10b981) accents.
Include subtle grid patterns and financial data flow representations.
Style: professional, corporate, fintech aesthetic, no text.
Aspect ratio 16:9, high quality.`,
  },
];

async function generateImage(
  ai: GoogleGenAI,
  prompt: string,
  filename: string
): Promise<void> {
  console.log(`\nGenerating: ${filename}...`);

  const config = {
    responseModalities: ['IMAGE', 'TEXT'] as const,
    imageConfig: {
      imageSize: '1K' as const,
    },
  };

  const model = 'gemini-2.0-flash-exp-image-generation';

  const contents = [
    {
      role: 'user' as const,
      parts: [{ text: prompt }],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    for await (const chunk of response) {
      if (!chunk.candidates?.[0]?.content?.parts) {
        continue;
      }

      const inlineData = chunk.candidates[0].content.parts[0]?.inlineData;
      if (inlineData) {
        const fileExtension = mime.getExtension(inlineData.mimeType || '') || 'png';
        const buffer = Buffer.from(inlineData.data || '', 'base64');
        const filePath = path.join(OUTPUT_DIR, `${filename}.${fileExtension}`);

        await writeFile(filePath, buffer);
        console.log(`Saved: ${filePath}`);
      } else if (chunk.text) {
        console.log(`Response text: ${chunk.text}`);
      }
    }
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
  }
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is required');
    console.log('Usage: GEMINI_API_KEY=your_key npx ts-node scripts/generate-blog-images.ts');
    process.exit(1);
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Ensure output directory exists
  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log('Starting blog image generation...');
  console.log(`Output directory: ${OUTPUT_DIR}`);

  for (const image of BLOG_IMAGES) {
    await generateImage(ai, image.prompt, image.filename);
  }

  console.log('\nDone! Remember to update blog posts to use the new image extensions.');
}

main();
