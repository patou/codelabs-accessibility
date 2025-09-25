import { getSolutionHtml } from '@/lib/actions';
import { SolutionView } from './solution-view';

export const dynamic = 'force-dynamic';

export default async function SolutionPage() {
  const solutionContent = await getSolutionHtml();

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden">
      <SolutionView content={solutionContent} />
    </div>
  );
}
