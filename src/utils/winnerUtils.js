/**
 * Winner Calculation Utility
 * 
 * Logic:
 * 1. Filter submissions for the specific question.
 * 2. Filter only correct answers.
 * 3. Sort by timestamp (ascending) - Earliest correct answer wins.
 * 4. Return the top result.
 */

export const calculateWinner = (submissions) => {
    if (!submissions || submissions.length === 0) return null;

    // 1. Filter correct answers
    const correctSubmissions = submissions.filter(s => s.isCorrect);

    if (correctSubmissions.length === 0) return null;

    // 2. Sort by timestamp (Earliest first)
    correctSubmissions.sort((a, b) => {
        return new Date(a.submittedAt) - new Date(b.submittedAt);
    });

    // 3. Return the winner
    return correctSubmissions[0];
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ar-SA');
};
