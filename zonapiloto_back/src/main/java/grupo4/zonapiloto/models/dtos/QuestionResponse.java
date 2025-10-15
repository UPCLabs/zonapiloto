package grupo4.zonapiloto.models.dtos;

public class QuestionResponse {
    private Long questionId;
    private String question;
    private String answer;
    private Long categoryId;
    private String categoryName;

    public String getAnswer() {
        return answer;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public String getQuestion() {
        return question;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

}
