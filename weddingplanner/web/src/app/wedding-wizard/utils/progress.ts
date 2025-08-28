export interface WizardProgress {
    currentStep: number;
    completedSteps: number[];
    lastUpdated: string;
}

export const PROGRESS_STORAGE_KEY = "wedding-wizard-progress";

export const saveWizardProgress = (
    currentStep: number,
    completedSteps: number[]
) => {
    if (typeof window !== "undefined") {
        const progress: WizardProgress = {
            currentStep,
            completedSteps,
            lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));

        // Dispatch custom event to notify components of progress update
        window.dispatchEvent(new CustomEvent("wedding-progress-updated"));
    }
};

export const getWizardProgress = (): WizardProgress => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn(
                    "Failed to parse wizard progress from localStorage"
                );
            }
        }
    }
    return {
        currentStep: 1,
        completedSteps: [],
        lastUpdated: new Date().toISOString(),
    };
};

export const markStepCompleted = (stepId: number) => {
    const progress = getWizardProgress();
    if (!progress.completedSteps.includes(stepId)) {
        progress.completedSteps.push(stepId);
        progress.completedSteps.sort((a, b) => a - b); // Keep sorted
        saveWizardProgress(progress.currentStep, progress.completedSteps);
    }
};

export const markStepInProgress = (stepId: number) => {
    const progress = getWizardProgress();
    progress.currentStep = stepId;
    saveWizardProgress(stepId, progress.completedSteps);
};

export const getStepStatus = (
    stepId: number,
    currentStepFromProps?: number
): "completed" | "current" | "pending" => {
    // If we have currentStep from wizard props, use it (for main wizard page)
    if (currentStepFromProps) {
        if (stepId < currentStepFromProps) return "completed";
        if (stepId === currentStepFromProps) return "current";
        return "pending";
    }

    // Otherwise, use localStorage to track progress across pages
    const progress = getWizardProgress();
    if (progress.completedSteps.includes(stepId)) return "completed";
    if (progress.currentStep === stepId) return "current";
    return "pending";
};
