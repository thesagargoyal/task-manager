import type { Priority } from '../types/Task';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          ring: 'ring-red-300',
          emoji: '🔴',
          label: 'High',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          ring: 'ring-yellow-300',
          emoji: '🟡',
          label: 'Medium',
        };
      case 'low':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          ring: 'ring-green-300',
          emoji: '🟢',
          label: 'Low',
        };
    }
  };

  const styles = getPriorityStyles();

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${styles.bg} ${styles.text} ${styles.ring}`}
    >
      <span>{styles.emoji}</span>
      <span>{styles.label}</span>
    </span>
  );
};

export default PriorityBadge;
