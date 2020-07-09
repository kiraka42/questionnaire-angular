import { Answer } from "./answer";
import { Statement } from "./statement";
import { Serializable } from "./serializable";

export class Theme implements Serializable<Theme>{
    title: string;
    description: string;
    image: string;
    statements: Statement[];
    isFinished: boolean;
    niveauInclusivite: number;

    deserialize(input): Theme {
        this.title = input.title;
        this.description = input.description;
        this.image = input.imahe;
        this.isFinished = false;
        this.niveauInclusivite = 0;
        this.deserializeStatements(input.statements);
        
        return this;
    }

    //For Objects array
    deserializeStatements(statements: Object[]) {
        this.statements = [];

        statements.forEach(obj => {
            let statement = new Statement().deserialize(obj);
            this.statements.push(statement);
          });
    }
}
