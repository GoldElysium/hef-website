export interface IPausingRecipeEmail {
	readonly recipe: 'email';
	readonly complete: (emailAddress: string) => void;
	readonly cancel: () => void;
	readonly isCompleting: boolean;
	readonly emailAddress: string;
}
