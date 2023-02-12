export default class CLIParser {
    options: Record<string, CLIParserOptions>;
    actions: Record<string, (...args: string[]) => void>;

    constructor(options: Record<string, CLIParserOptions>, actions: Record<string, (...args: string[]) => void>) {
        this.options = options;
        this.actions = actions;

        Object.keys(options).forEach(element => {
            if (!actions[element]) {
                throw new Error(`${element} does not have a matching action`);
            }
        });
    }

    parse(input: string) {
        const parseInput = input.split(/ +(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const args = parseInput.slice(1);

        const commandObj = this.options[parseInput[0]];


        if (!commandObj) {
            throw new Error(`'${parseInput[0]}' does not exist`);
        }

        this.actions[parseInput[0]](...args);
    }
}

interface CLIParserOptions {
    arguments?: [{
        description?: string;
        optional: boolean;
    }];
}
