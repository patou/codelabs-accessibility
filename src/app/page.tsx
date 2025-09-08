import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';

export default function Home() {
  const id = randomBytes(8).toString('hex');
  redirect(`/edit/${id}`);
}
