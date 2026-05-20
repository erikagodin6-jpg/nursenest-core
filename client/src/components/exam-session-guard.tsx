import { useExamNavigationGuard, type ExamGuardMode } from "@/hooks/use-exam-navigation-guard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ExamSessionGuardProps {
  isActive: boolean;
  mode: ExamGuardMode;
  onSubmitAndExit: () => void | Promise<void>;
}

export function ExamSessionGuard({ isActive, mode, onSubmitAndExit }: ExamSessionGuardProps) {
  const { showLeaveModal, continueExam, submitAndExit } = useExamNavigationGuard({
    isActive,
    mode,
    onSubmitAndExit,
  });

  return (
    <Dialog open={showLeaveModal} onOpenChange={(open) => { if (!open) continueExam(); }}>
      <DialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          continueExam();
        }}
        data-testid="dialog-leave-exam"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <DialogTitle className="text-lg font-semibold" data-testid="heading-leave-exam">
              Leave exam?
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-600 leading-relaxed" data-testid="text-leave-exam-description">
            You are currently in an active CAT exam. Leaving this session may submit or end your exam. Your progress, timer, and exam state could be affected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={submitAndExit}
            className="w-full sm:w-auto"
            data-testid="button-submit-and-exit"
          >
            Submit and Exit
          </Button>
          <Button
            onClick={continueExam}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            data-testid="button-continue-exam"
          >
            Continue Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
