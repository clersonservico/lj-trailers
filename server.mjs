import express from "express";
import multer from "multer";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
dotenv.config();
const app=express();
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024},fileFilter:(_r,f,cb)=>{const ok=["image/jpeg","image/png","image/webp"].includes(f.mimetype);cb(ok?null:new Error("Envie JPG, PNG ou WEBP."),ok)}});
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const here=path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(here,"public")));
app.post("/api/diagnostico",upload.single("photo"),async(req,res)=>{
 try{
  if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"A IA ainda não está configurada no servidor."});
  if(!req.file)return res.status(400).json({error:"Anexe uma fotografia válida."});
  let catalog=[];try{catalog=JSON.parse(req.body.catalog||"[]")}catch{}
  const image=`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const prompt=`És assistente de triagem técnica da LJ Trailers, especializado em reboques. Analisa a fotografia e descrição: ${String(req.body.description||"Não fornecida").slice(0,2000)}. Catálogo disponível: ${JSON.stringify(catalog)}. Responde APENAS JSON válido: {"avaria":"descrição prudente","gravidade":"baixa|média|alta|indeterminada","ids":[],"recomendacao":"próximo passo seguro"}. Usa apenas IDs do catálogo e apenas se forem claramente relevantes. Se a imagem não permitir identificar, diz isso. Não recomendes usar o reboque se houver suspeita de falha em travões, rodas, eixo, engate ou estrutura; recomenda parar a utilização e pedir inspecção. Não inventes certezas.`;
  const response=await client.responses.create({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",input:[{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:image,detail:"high"}]}]});
  const raw=response.output_text||"",clean=raw.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"").trim();
  const result=JSON.parse(clean),valid=new Set(catalog.map(x=>x.id));
  result.ids=Array.isArray(result.ids)?result.ids.filter(id=>valid.has(id)):[];
  res.json({result});
 }catch(err){console.error(err);res.status(500).json({error:"Não foi possível realizar o diagnóstico. Tente novamente ou contacte a LJ Trailers."})}
});
app.use((err,_req,res,_next)=>res.status(400).json({error:err.message||"Pedido inválido."}));
app.listen(process.env.PORT||3000,()=>console.log("LJ Trailers: servidor iniciado"));
