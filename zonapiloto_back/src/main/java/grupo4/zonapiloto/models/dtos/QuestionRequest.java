package grupo4.zonapiloto.models.dtos;

public class QuestionRequest {
    private String question;
    private String answer;
    private Long categoryId;

    public String getAnswer() {
        return answer;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getQuestion() {
        return question;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
