const { SlashCommandBuilder } = require('@discordjs/builders');
const { letter } = require('../utils/emotes.json');
const { returnDayWord } = require('./novapalavra.js');

async function awaitMessage(interaction) {
	const filter = (msg) => interaction.user.id === msg.author.id;
	const sendedMessage = await interaction.channel.awaitMessages({ max: 1, filter }).then((msg) => {
		const response = { content: '', message: msg.first() };
		const content = msg.first().content;
		if (content) response.content = content;

		return response;
	});

	return sendedMessage;
}

async function convertMessageContentToEmojis(interaction, content, correctWord) {
	const contentArray = content.split('');
	const correctWordArray = correctWord.split('');

	const usedLetters = [];

	const finalMessage = {
		'1': '',
		'2': '',
		'3': '',
		'4': '',
		'5': '',
	};

	for (let i = 0; i < contentArray.length; i++) {
		if (contentArray[i] === correctWordArray[i]) {
			usedLetters.push(contentArray[i]);
			finalMessage[`${i + 1}`] = letter['green'][correctWordArray[i]];
		}
	}

	for (let i = 0; i < contentArray.length; i++) {

		if (correctWordArray.includes(contentArray[i]) && contentArray[i] !== correctWordArray[i]) {
			usedLetters.push(contentArray[i]);

			const caracterCountCorrect = correctWordArray.filter(car => car === contentArray[i]);
			const caracterCountContent = usedLetters.filter(car => car === contentArray[i]);

			if (caracterCountContent.length > caracterCountCorrect.length) {finalMessage[`${i + 1}`] = letter['gray'][contentArray[i]];}
			else {finalMessage[`${i + 1}`] = letter['yellow'][contentArray[i]];}
		}
		else if (contentArray[i] !== correctWordArray[i]) {
			usedLetters.push(contentArray[i]);

			finalMessage[`${i + 1}`] = letter['gray'][contentArray[i]];
		}
	}

	const finalReply = Object.values(finalMessage).map(emoji => emoji).join(' ');

	await interaction.editReply(finalReply);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adivinhar')
		.setDescription('Tente adivinhar a palavra do dia'),
	async execute(interaction) {
		await interaction.reply('Adivinhe o **PALAVRECO** de hoje! :eyes:');

		const correctWord = returnDayWord();
		const receivedMessage = await awaitMessage(interaction);

		if (receivedMessage.content.length != 5) {
			await interaction.editReply('A palavra tem que ter 5 letras!');
			await receivedMessage.message.delete();
		}
		else if (correctWord == '') {
			await interaction.editReply('Não há palavra do dia, use o comando `/novapalavra` para setar uma.');
			await receivedMessage.message.delete();
			return;
		}
		else {
			await convertMessageContentToEmojis(interaction, receivedMessage.content.toLowerCase(), correctWord.toLowerCase());
			await receivedMessage.message.delete();
		}
	},
};