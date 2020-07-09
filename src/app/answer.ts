import { Serializable } from "./serializable";

export class Answer implements Serializable<Answer>{
    entitled: string;
    weight: number;
    value: number;
    
    deserialize(input): Answer {
        this.entitled = input.entitled;
        this.weight = input.weight;
        this.value = 0;
        return this;
    }
}
