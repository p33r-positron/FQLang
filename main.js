#!/bin/node
const fs = require("fs");
const path = require("path");

const config = require("./config.json");

const special1 = config.keyword_alphabet.map(letter=>`${letter}\\=`).join("|");
const special2 = "\\<|\<\\=|\\=\\=|\\=|\\>|\\>|\\*|\\+|\\-|\\/|\\¿|\\?|\\¡|\\!|\\:|\\;|\\(|\\)|\\{|\\}|\\[|\\]|\\,|ª|ºº|º|°°|°|\\@nl";
const special = new RegExp(`(${special1}${special2})`);

const keywords = ["i0","i8","i16","i32","i64","u0","u8","u16","u32","u64","a=","b=","c=","f=","f","i=","l=","s=","ª","ºº","º","°°","°","@nl"];
const types = keywords.slice(0,11);
const ponctu = ["(",")","[","]","{","}",";",","];
const operators = ["+","-","*","/","%","<","!=","<=",">=","==","=",">","&","|","^","&&","||","^^","~","!",":","¿","?","¡","!","->"];

const libloc = "./lib/";

function firstlast(str){
	return str.charAt(0) + str.slice(-1);
}

function error(err){
	console.log("[FQLang]"+err);
	process.exit(1);
}

function iutype2c(t){
	if(parseInt(t.slice(1)))
		return (t.charAt(0)=="u"?"unsigned ":"")+["void","char","short",0,"int",0,0,0,"long long"][parseInt(t.replaceAll("*","").slice(1)/8)]+(t.indexOf("*")!==-1?t.match(/\*+/)[0]:"");
	return "void";
}

function parse(data){
	data = data.replace(/\/\/(.*?)\n/g, "\n");
	data = data.replaceAll("\n", "@nl")
	data = data.split(special).join("🤠🙁🤠");
	data = data.match(/(?:[^\s|🤠🙁🤠"]+|"[^"]*")+/g);
	data = data.map(x=>x.replaceAll("🤠🙁🤠",""))
	return data;
}

function lex(parsed_o){
	var parsed = parse(parsed_o);
	var final = [];
	for(var i = 0 ; i < parsed.length ;){
		if(keywords.includes(parsed[i])){
			final.push({
				"type":"keyword",
				"raw": parsed[i]
			});
			i++;
		}
		else if(ponctu.includes(parsed[i])){
			final.push({
				"type":"ponctu",
				"raw":parsed[i]
			});
			i++;
		}
		else if(operators.includes(parsed[i])){
			if(parsed[i] == "*" && types.includes(final[final.length-2].raw.replace(/\*/g,"")))
			{
				final[final.length-2].raw += "*";
			}
			else{
				final.push({
					"type":"operator",
					"raw":parsed[i]
				});
			}
			i++;
		}
		else if(!isNaN(Number(parsed[i]))){
			if(Number(parsed[i]) == parseInt(parsed[i])){
				final.push({
					"type":"litteral",
					"subtype":"int",
					"raw":parsed[i]
				});
			}
			else if(Number(parsed[i]) == parseFloat(parsed[i])){
				final.push({
					"type":"litteral",
					"subtype":"float",
					"raw":parsed[i]
				});
			};
			i++;
		}
		else if(firstlast(parsed[i]) == "\"\""){
			final.push({
				"type":"litteral",
				"subtype":"string",
				"raw":parsed[i]
			});
			i++;
		}
		else if(firstlast(parsed[i]) == "\'\'"){
			final.push({
				"type":"litteral",
				"subtype":"char",
				"raw":parsed[i]
			});
			i++;
		}
		else{
			let id = parsed[i].match(/[a-zA-Z_][a-zA-Z0-9_]*/);
			let num = parseInt(parsed[i].replace(id[0],""));
			if(!isNaN(num))
			final.push({
				"type":"litteral",
				"subtype":"int",
				"raw":num
			});
			final.push({
				"type":"identifier",
				"raw":id[0]
			});
			i++;
		}
	}
	return final;
}

function gen_1(lexed_o){
	var lexed = lex(lexed_o);
	var final = [];
	var replacenextsemicolonwith = ";";
	for(var i = 0 ; i < lexed.length ;){
		if(lexed[i].type == "keyword"){
			switch(lexed[i].raw){
				case "a=":
					i++;
					break;
				case "b=":
					if(lexed[i+1].subtype !== "string")
					error("You must follow \"b=\" with a string.");
					return gen_1(lexed_o.replace(new RegExp(`b(\\s*)\\=(\\s*)${lexed[i+1].raw};`), fs.readFileSync(lexed[i+1].raw.slice(1,-1), {"encoding":"utf-8"}).concat("@nl")));
					/*final.push({
						"type":"rawc",
						"raw":"#include <"+lexed[i+1].raw.slice(1,-1)+">\n"
					});
					replacenextsemicolonwith = " ";
					i+=2;*/
					break;
				case "c=":
					final.push({
						"type":"rawc",
						"raw":lexed[i+1].raw.slice(1,-1)
					});
					i+=3;
					break;
				case "s=":
					if((lexed[i+1].type !== "litteral" || lexed[i+1].subtype !== "int") && lexed[i+1].type !== "identifier") //remove if you need to do obfuscated shit
					error("[FQLang] Expected syscall number or SYS_* constant after syscall"); //this too
					final.push({
						"type":"rawc",
						"raw":"syscall("
					});
					i++;
					while(lexed[i].raw !== ";"){
						final.push({
							"type":"rawc",
							"raw":lexed[i].raw
						});
						i++;
					}
					final.push({
						"type":"rawc",
						"raw":");"
					});
					i++;
					break;
				case "f=":
					final.push({
						"type":"rawc",
						"raw":"return "
					});
					i++;
					break;
				case "i=":
					final.push({
						"type":"rawc",
						"raw":"goto "
					});
					i++;
					break;
				case "l=":
					if(lexed[i+1].subtype !== "string")
					error("You must follow \"l=\" with a string.");
					return gen_1(lexed_o.replace(new RegExp(`l(\\s*)\\=(\\s*)${lexed[i+1].raw};`), fs.readFileSync(path.join(libloc, lexed[i+1].raw.slice(1,-1)), {"encoding":"utf-8"}).concat("@nl")));
					/*final.push({
						"type":"rawc",
						"raw":"#include <"+lexed[i+1].raw.slice(1,-1)+">\n"
					});
					replacenextsemicolonwith = " ";
					i+=2;*/
					break;
				case "ª":
					let j = i;
					while(lexed[j].raw !== ";" && lexed[j].raw !== "º" && lexed[j].raw !== "°")
					j++;
					final.push({
						"type":"rawc",
						"raw":lexed[j].raw==";"?"for(":"while("
					});
					i++;
					break;
				case "ºº":
				case "°°":
					final.push({
						"type":"rawc",
						"raw": "do"
					});
					i++;
					break;
				case "º":
				case "°":
					if(false){ //for later
					} else {
						final.push({
							"type":"rawc",
							"raw":")"
						});
					}
					i++;
					break;
				case "@nl":
					if(false){ //for later
					} else {
						final.push({
							"type":"rawc",
							"raw":"\n"
						});
					}
					i++;
					break;
				default:
					if(types.includes(lexed[i].raw.replace(/\*/g,""))){
						final.push({
							"type":"rawc",
							"raw":iutype2c(lexed[i].raw)+" "
						});
					}
					else {
						final.push({
							"type":"rawc",
							"raw":lexed[i].raw
						});
					}
					i++;
			}
		}
		else if(lexed[i].type == "identifier"){
			final.push({
				"type":"rawc",
				"raw":lexed[i].raw+" "
			});
			i++;
		}
		else if(lexed[i].type == "ponctu"){
			if(lexed[i].raw == ";" && replacenextsemicolonwith != ";"){
				final.push({
					"type":"rawc",
					"raw":replacenextsemicolonwith
				});
				replacenextsemicolonwith = ";";
			}
			else {
				final.push({
					"type":"rawc",
					"raw":lexed[i].raw==";"?";\n":lexed[i].raw
				});
			}
			i++;
		}
		else if(lexed[i].type == "operator"){
			switch(lexed[i].raw){
				case "¿":
					final.push({
						"type":"rawc",
						"raw":"if("
					});
					break;
				case "?":
					final.push({
						"type":"rawc",
						"raw":"){\n"
					});
					break;
				case "¡":
					final.push({
						"type":"rawc",
						"raw":"}else{\n"
					});
					isinelse++;
					break;
				case "!":
					let j = i;
					while(lexed[j].type !== "identifier" && lexed[j].type !== "keyword" && lexed[j].type !== "litteral" && lexed[j].raw !== ";")
					j++;
					final.push({
						"type":"rawc",
						"raw":lexed[j].raw==";"?"}\n":"!"
					});
					break;
				case ":":
					if(final[final.length-1].raw==")"){
						final.push({
							"type":"rawc",
							"raw":"{return "
						});
						replacenextsemicolonwith = ";}\n";
					} else {
						final.push({
							"type":"rawc",
							"raw":":"
						});
					}
					break;
				case "=":
					if(lexed[i+1].raw == "f")
						i++;
					else{
						final.push({
							"type":"rawc",
							"raw":lexed[i].raw
						});
					}
					break;
				default:
					final.push({
						"type":"rawc",
						"raw":lexed[i].raw
					});
			}
			i++;
		}
		else if(lexed[i].type == "litteral"){
			switch(lexed[i].subtype){
				case "int":
					if(lexed[i+1].type == "identifier")
					{
						final.push({
							"type":"rawc",
							"raw": `${lexed[i+1].raw}[${lexed[i].raw}]`
						});
						i++;
					}
					else {
						final.push({
							"type":"rawc",
							"raw":lexed[i].raw
						});
					}
					i++;
					break;
				default:
					final.push({
						"type":"rawc",
						"raw":lexed[i].raw
					});
					i++;
			}
		}
		else{
			final.push({
				"type":"rawc", //i shouldnt do that
				"raw":lexed[i].raw
			});
			i++;
		}
	}
	if(lexed_o.indexOf("s=") !== -1){
		final.unshift({
			"type":"rawc",
			"raw":"#include <unistd.h>\n#include <sys/syscall.h>\n" //fuck non-linux users, all my homies hate non-linux users
		})
	}
	return final;
}

function gen_2(gen1ed){
	var final = "";
	for(var i = 0 ; i < gen1ed.length;){
		if(gen1ed[i].type == "rawc")
		final += gen1ed[i].raw;
		i++;
	}
	return final;
}

function main(argc, argv){
	if(argc != 3)
	error("node 0to1.js <file>");
	const data = fs.readFileSync(argv[2], {"encoding":"utf-8"});
	const parsed = parse(data);
	const lexed = lex(data);
	const gen1ed = gen_1(data);
	const gen2ed = gen_2(gen1ed);
	fs.writeFileSync(argv[2].replace(".fq",".c"), gen2ed, {"encoding":"utf-8"});
	console.log("[FQLang] Transpiled to "+argv[2].replace(".fq",".c")+" !");
	process.exit(0);
}

main(process.argv.length, process.argv);
