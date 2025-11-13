import React, { useState, useRef } from "react";
import JSZip from "jszip";
import {
  Upload, FileCode, Play, Settings, Github, Download, Rocket,
  MessageCircle, User, Globe, Plus, Search, Copy, Trash2, ExternalLink,
  ChevronDown, ChevronUp
} from "lucide-react";

/*--------------------------------------------------------------------
  YOU-N-I-VERSE PORTAL
  Floating Chat + URL Selector + Zip Preview + Deploy Menu (Netlify/Vercel)
--------------------------------------------------------------------*/

export default function YouNIVersePortal() {
  /* -----------------------------
     ZIP / PREVIEW STATES
  ------------------------------*/
  const [zipFile, setZipFile] = useState(null);
  const [fileTree, setFileTree] = useState([]);
  const [entryPoint, setEntryPoint] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [deployMenuOpen, setDeployMenuOpen] = useState(false);
  const iframeRef = useRef(null);

  /* -----------------------------
     ZIP UPLOAD → PARSE
  ------------------------------*/
  async function handleZipUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setZipFile(file);
    const zip = await JSZip().loadAsync(file);

    const files = [];
    zip.forEach((p, entry) => !entry.dir && files.push(p));
    setFileTree(files);

    const defaults = files.filter(f =>
      f.endsWith("index.html") ||
      f.endsWith("index.js") ||
      f.endsWith("main.html")
    );

    if (defaults.length > 0) setEntryPoint(defaults[0]);
  }

  /* -----------------------------
     PREVIEW ENTRY FILE
  ------------------------------*/
  async function previewBuild() {
    if (!entryPoint || !zipFile) return alert("Pick an entry file.");

    const zip = await JSZip().loadAsync(zipFile);
    const content = await zip.file(entryPoint).async("string");

    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setPreviewSrc(url);
  }

  /* -----------------------------
     DEPLOY BUTTON PLACEHOLDERS
  ------------------------------*/
  function pushToGitHub() {
    alert("Connect backend token endpoint → ready for GitHub push.");
  }

  function deployToNetlify() {
    alert("Add Netlify Token + Site ID → deploy ready.");
  }

  function deployToVercel() {
    alert("Add Vercel Token + Project ID → deploy ready.");
  }

  /* -----------------------------
     URL SELECTOR STATE
  ------------------------------*/
  const [urls, setUrls] = useState([
    { id: 1, name: 'GitHub', url: 'https://github.com', icon: '🐙', favorite: true },
    { id: 2, name: 'StackOverflow', url: 'https://stackoverflow.com', icon: '📚', favorite: true },
  ]);

  const [recentUrls, setRecentUrls] = useState([]);
  const [urlSearch, setUrlSearch] = useState("");
  const [newUrlName, setNewUrlName] = useState("");
  const [newUrlLink, setNewUrlLink] = useState("");
  const [newUrlIcon, setNewUrlIcon] = useState("🔗");
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [selectorPos, setSelectorPos] = useState({ x: 20, y: 20 });
  const [selectorDragging, setSelectorDragging] = useState(false);
  const [selectorDragStart, setSelectorDragStart] = useState({ x: 0, y: 0 });

  function openUrl(u) {
    window.open(u.url, "_blank");
    setRecentUrls(prev => [{ ...u, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
  }

  /* -----------------------------
     FLOATING CHAT STATE
  ------------------------------*/
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! Welcome 💜", sender: "bot" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatPos, setChatPos] = useState({ x: 300, y: 80 });
  const [chatDragging, setChatDragging] = useState(false);
  const [chatDragStart, setChatDragStart] = useState({ x: 0, y: 0 });

  function sendChat() {
    if (!chatInput.trim()) return;

    const msg = { id: Date.now(), text: chatInput, sender: "user" };
    const reply = {
      id: Date.now() + 1,
      text: "Love that energy! ✨",
      sender: "bot"
    };

    setMessages(prev => [...prev, msg, reply]);
    setChatInput("");
  }

  /* -----------------------------
     RENDER PAGE
  ------------------------------*/
  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">

      {/* -------------------------
          HEADER + DEPLOY BUTTON
      ---------------------------*/}
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          YOU-N-I-VERSE BUILDER PORTAL 🌌
        </h1>

        {/* DEPLOY DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setDeployMenuOpen(!deployMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
          >
            <Rocket size={20} /> Deploy {deployMenuOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          {deployMenuOpen && (
            <div className="absolute right-0 mt-2 bg-slate-800 rounded-lg p-2 border border-purple-500/40">
              <button onClick={pushToGitHub} className="w-full flex items-center gap-2 p-2 hover:bg-slate-700">
                <Github size={16} /> GitHub Push
              </button>

              <button onClick={deployToNetlify} className="w-full flex items-center gap-2 p-2 hover:bg-slate-700">
                <ExternalLink size={16} /> Netlify Deploy
              </button>

              <button onClick={deployToVercel} className="w-full flex items-center gap-2 p-2 hover:bg-slate-700">
                <ExternalLink size={16} /> Vercel Deploy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* -------------------------
          ZIP UPLOAD + FILE TREE
      ---------------------------*/}
      <div className="bg-slate-800/40 p-6 rounded-xl border border-purple-500/40 mb-8">
        <input type="file" accept=".zip" id="zip-upload" className="hidden" onChange={handleZipUpload} />

        <label
          htmlFor="zip-upload"
          className="block cursor-pointer p-10 border-2 border-dashed border-purple-500/50 rounded-xl text-center hover:bg-slate-800/40"
        >
          <Upload size={48} className="text-purple-300 mx-auto mb-4" />
          {zipFile ? zipFile.name : "Drop ZIP here or click to browse"}
        </label>

        {fileTree.length > 0 && (
          <div className="mt-6">

            <div className="max-h-40 overflow-y-auto bg-slate-900 p-3 rounded-md mb-4 text-sm font-mono border border-purple-500/20">
              {fileTree.map((f, i) => <div key={i}>{f}</div>)}
            </div>

            <select
              value={entryPoint}
              onChange={(e) => setEntryPoint(e.target.value)}
              className="w-full bg-slate-700 border border-purple-500/40 px-4 py-2 rounded-lg"
            >
              <option>Select entry file…</option>
              {fileTree.map((f, i) => (
                <option key={i} value={f}>{f}</option>
              ))}
            </select>

            <button
              onClick={previewBuild}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-lg"
            >
              <Play /> Preview
            </button>
          </div>
        )}
      </div>

      {/* -------------------------
          PREVIEW PANEL
      ---------------------------*/}
      {previewSrc && (
        <div className="w-full h-[600px] bg-black rounded-xl overflow-hidden border-2 border-purple-500/50">
          <iframe src={previewSrc} className="w-full h-full bg-white"></iframe>
        </div>
      )}

      {/* -------------------------
          FLOATING CHAT BOX
      ---------------------------*/}
      <div
        style={{ left: chatPos.x, top: chatPos.y }}
        className="fixed z-50 w-80 rounded-xl overflow-hidden bg-slate-900/90 border border-purple-500/40"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 font-bold flex items-center gap-2">
          <MessageCircle /> Chat
        </div>
        <div className="p-3 max-h-60 overflow-y-auto">
          {messages.map(m => (
            <div key={m.id} className={`mb-2 ${m.sender === "user" ? "text-right" : ""}`}>
              <span className={`inline-block px-3 py-1 rounded-lg ${m.sender === "user" ? "bg-purple-600" : "bg-slate-700"}`}>
                {m.text}
              </span>
            </div>
          ))}
        </div>
        <div className="p-3 flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            className="flex-1 bg-slate-800 border border-purple-500/30 px-3 py-2 rounded-lg"
          />
          <button onClick={sendChat} className="bg-purple-600 px-3 py-2 rounded-lg">➤</button>
        </div>
      </div>

      {/* -------------------------
          FLOATING URL SELECTOR
      ---------------------------*/}
      <div
        style={{ left: selectorPos.x, top: selectorPos.y }}
        className="fixed z-50 w-80 rounded-xl overflow-hidden bg-slate-900/95 border border-purple-500/40"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 font-bold flex items-center gap-2">
          <Globe /> URLs
        </div>

        <div className="p-3 max-h-60 overflow-y-auto">
          {urls.map(u => (
            <div
              key={u.id}
              onClick={() => openUrl(u)}
              className="mb-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer flex items-center gap-2"
            >
              <span>{u.icon}</span>
              <span>{u.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
