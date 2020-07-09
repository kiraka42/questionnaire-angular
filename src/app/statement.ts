import { Answer } from "./answer";
import { Serializable } from "./serializable";

export class Statement implements Serializable<Statement> {
    question: string;
    answers: Answer[];

    deserialize(input): Statement {
        this.question = input.question;
        this.deserializeAnswers(input.answers);
        return this;
    }

    //For Objects array
    deserializeAnswers(answers: Object[]) {
        this.answers = [];

        answers.forEach(obj => {
            let answer = new Answer().deserialize(obj);
            this.answers.push(answer);
        });
    }
}
