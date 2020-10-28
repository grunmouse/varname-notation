/**
 * Преобразует любую юникодную строку в валидное имя переменной
 * и обратно.
 */

/**
 * Буквы t и u - являются служебными символами.
 * Буква u требует после себя шестнадцатиричное число в верхнем регистре и отображается
 * в соответствующий юникодный символ.
 * Буква t требует после себя любую латинскую букву или цифру и отображается в неё
 * (служит для экранирования).
 *
 * При преобразовании строки в имя
 * Строчные латинские буквы, кроме t и u, представляются как есть,
 * буквы t и u представляются инструкцией t.
 * Заглавные латинские буквы, начиная с G представляются как есть,
 * буквы с A по F - представляются как есть, если они не идут следом за инструкцией u,
 * если буквы с A по F идут за инструкцией u, то они представляются инструкцией t.
 * Цифры представляются как есть, если они не идут за инструкцией u и не стоят в начале строки,
 * в противном случае они представляются инструкцией t.
 * Все символы, не являющиеся латинской буквой или цифрой, представляются инструкцией u
 */


const config = {
	0:{
		text:"0123456789ut",
		normal:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrsvwxyz",
	},
	1:{
		text:"0123456789ABCDEFut",
		normal:"GHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrsvwxyz",
	},
	2:{
		text:"ut",
		normal:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrsvwxyz",
	}
};

const pattern = /t([A-Za-z0-9])|u([0-9A-F]+)|([A-Za-sv-z0-9])/g;

function encode(str){
	let state = config[0];
	const buffer = [];
	for(let point of str){
		if(state.normal.includes(point)){
			buffer.push(point);
			state = config[2];
		}
		else if(state.text.includes(point)){
			buffer.push('t'+point);
			state = config[2];
		}
		else{
			buffer.push('u', point.codePointAt(0).toString(16).toUpperCase());
			state = config[1];
		}
	}
	return buffer.join('');
}

function decode(varname){
	return varname.replace(pattern, (str, escaped, hex, normal)=>{
		return escaped || normal || String.fromCodePoint(parseInt(hex, 16));
	});
}

module.exports = {
	encode,
	decode
}