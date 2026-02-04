import { skillsMetadata } from './metadata';

export const metadata = skillsMetadata;

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
