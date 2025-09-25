import fs from 'fs/promises';
import path from 'path';
import { SolutionView } from './solution-view';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getSolutionHtml(): Promise<string> {
    try {
        const filePath = path.join(process.cwd(), 'src/lib/solution.html');
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error("Failed to read solution.html", error);
        notFound();
    }
}

export default async function SolutionPage() {
  const solutionContent = await getSolutionHtml();

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden">
      <SolutionView content={solutionContent} />
    </div>
  );
}
