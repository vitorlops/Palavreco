export interface Word {
    word: string;
    status: boolean;
}

export interface User {
    id: string;
    status: boolean;
    gamesWins: number[];
    streak: number[];
    guesses: number[];
    rank: number[];
    guilds: string[];
}
