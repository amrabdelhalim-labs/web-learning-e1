import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import CustomizedListItem from '@/app/components/SideBar/CustomizedListItem';

const mockPush = vi.fn();
const mockSetOpenMobile = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/app/hooks/useAppContext', () => ({
  useAppContext: () => ({ setOpenMobile: mockSetOpenMobile }),
}));

function LessonsHarness() {
  const [expandedLessonSlug, setExpandedLessonSlug] = useState<string | null>(null);

  return (
    <>
      <CustomizedListItem
        lectureName="الدرس الأول"
        lectureSlug="lesson-one"
        isExpanded={expandedLessonSlug === 'lesson-one'}
        isCurrentLesson={expandedLessonSlug === 'lesson-one'}
        currentSection={null}
        onToggle={() =>
          setExpandedLessonSlug((prev) => (prev === 'lesson-one' ? null : 'lesson-one'))
        }
      />
      <CustomizedListItem
        lectureName="الدرس الثاني"
        lectureSlug="lesson-two"
        isExpanded={expandedLessonSlug === 'lesson-two'}
        isCurrentLesson={expandedLessonSlug === 'lesson-two'}
        currentSection={null}
        onToggle={() =>
          setExpandedLessonSlug((prev) => (prev === 'lesson-two' ? null : 'lesson-two'))
        }
      />
    </>
  );
}

describe('lesson sidebar interaction', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockSetOpenMobile.mockReset();
  });

  it('expands only the clicked lesson item', () => {
    render(<LessonsHarness />);

    const firstLessonRow = screen.getByRole('button', { name: 'الدرس الأول' });
    const secondLessonRow = screen.getByRole('button', { name: 'الدرس الثاني' });

    fireEvent.click(firstLessonRow);
    expect(firstLessonRow).toHaveAttribute('aria-expanded', 'true');
    expect(secondLessonRow).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondLessonRow);
    expect(firstLessonRow).toHaveAttribute('aria-expanded', 'false');
    expect(secondLessonRow).toHaveAttribute('aria-expanded', 'true');
  });

  it('navigates correctly when clicking submenu and closes mobile drawer', () => {
    render(<LessonsHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'الدرس الأول' }));
    fireEvent.click(screen.getByRole('button', { name: 'ترجمة' }));

    expect(mockPush).toHaveBeenCalledWith('/lesson-one/translate');
    expect(mockSetOpenMobile).toHaveBeenCalledWith(false);
    expect(screen.getByRole('button', { name: 'الدرس الأول' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('renders all submenu items in expanded lesson and keeps next lesson interactive', () => {
    render(<LessonsHarness />);

    const firstLessonRow = screen.getByRole('button', { name: 'الدرس الأول' });
    const secondLessonRow = screen.getByRole('button', { name: 'الدرس الثاني' });

    fireEvent.click(firstLessonRow);

    expect(screen.getByRole('button', { name: 'شرح الدرس' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'أسئلة' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'محادثة' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ترجمة' })).toBeInTheDocument();

    // Expanding the next lesson should still work (no overlay blocks/click-through).
    fireEvent.click(secondLessonRow);
    expect(firstLessonRow).toHaveAttribute('aria-expanded', 'false');
    expect(secondLessonRow).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps expansion behavior stable after repeated interactions', () => {
    render(<LessonsHarness />);

    const firstLessonRow = screen.getByRole('button', { name: 'الدرس الأول' });
    const secondLessonRow = screen.getByRole('button', { name: 'الدرس الثاني' });

    fireEvent.click(firstLessonRow);
    fireEvent.click(secondLessonRow);
    fireEvent.click(secondLessonRow);
    fireEvent.click(firstLessonRow);

    expect(firstLessonRow).toHaveAttribute('aria-expanded', 'true');
    expect(secondLessonRow).toHaveAttribute('aria-expanded', 'false');
  });
});
