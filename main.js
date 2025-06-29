let editors = {
html: CodeMirror(document.getElementById('html'), {
mode: 'htmlmixed',
theme: 'dracula',
lineNumbers: true,
autoCloseTags: true,
extraKeys: {
"Ctrl-Space": "autocomplete",
"Tab": function(cm) {
if (cm.state.completionActive) {
cm.state.completionActive.close();
}
CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
}
},
matchTags: { bothTags: true },
value: localStorage.getItem("code-html") || "<h1>Hello World</h1>",
hintOptions: {
completeSingle: false,
hint: generateHtmlSuggestions // Use the fixed function
}
}),
css: CodeMirror(document.getElementById('css'), {
mode: 'css',
theme: 'monokai',
lineNumbers: true,
extraKeys: {
"Ctrl-Space": "autocomplete",
"Tab": function(cm) {
if (cm.state.completionActive) {
cm.state.completionActive.close();
}
CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
}
},
value: localStorage.getItem("code-css") || "body { font-family: Arial; }",
hintOptions: {
completeSingle: false,
hint: generateCssSuggestions // Use the fixed function
}
}),
js: CodeMirror(document.getElementById('js'), {
mode: 'javascript',
theme: 'material',
lineNumbers: true,
extraKeys: {
"Ctrl-Space": "autocomplete",
"Tab": function(cm) {
if (cm.state.completionActive) {
cm.state.completionActive.close();
}
CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
}
},
value: localStorage.getItem("code-js") || "console.log('Hello from JS')",
hintOptions: {
completeSingle: false,
hint: generateJsSuggestions // Use the fixed function
}
})
};

// AI autocompletion & suggestions

// HTML Suggestions - updated parameters
function generateHtmlSuggestions(cm, options) {
const cursor = cm.getCursor();
const token = cm.getTokenAt(cursor);
const line = cm.getLine(cursor.line);
const allLines = cm.getValue().split('\n');

const commonTags = ['div', 'span', 'p', 'a', 'img', 'ul', 'li', 'h1', 'h2', 'h3'];
const commonAttributes = ['class', 'id', 'style', 'src', 'href', 'alt', 'title'];

// If we're inside a tag
if (line.slice(0, cursor.ch).includes('<') && !line.slice(0, cursor.ch).includes('>')) {
// Attribute suggestions
if (token.string.match(/^\s*[\w-]*$/)) {
return commonAttributes.map(attr => ({
text: attr + '=""',
displayText: attr,
className: 'ai-attribute'
}));
}
}

// Tag suggestions
if (token.string.match(/^<\/?[\w-]*$/)) {
return commonTags.map(tag => ({
text: token.string.startsWith('</') ? `/${tag}>` : `${tag}>`,
displayText: tag,
className: 'ai-tag'
}));
}

// Default to anyword completion
return CodeMirror.hint.html(cm, options);
}

// Similar updates for CSS and JS hint functions
function generateCssSuggestions(cm, options) {
const cursor = cm.getCursor();
const token = cm.getTokenAt(cursor);
const line = cm.getLine(cursor.line);
const allLines = cm.getValue().split('\n');

const commonProperties = [
'color', 'background', 'font-size', 'margin', 'padding',
'border', 'display', 'position', 'width', 'height'
];
const commonValues = {
'color': ['red', 'blue', '#fff', 'rgb(0,0,0)', 'var(--primary)'],
'display': ['block', 'inline', 'flex', 'grid', 'none'],
'position': ['relative', 'absolute', 'fixed', 'sticky']
};

// Property suggestions
if (line.includes(':') && !line.includes(';')) {
const prop = line.split(':')[0].trim();
if (commonValues[prop]) {
return commonValues[prop].map(val => ({
text: val + ';',
displayText: val,
className: 'ai-value'
}));
}
} else {
return commonProperties.map(prop => ({
text: prop + ': ',
displayText: prop,
className: 'ai-property'
}));
}

return CodeMirror.hint.css(cm, options);
}

function generateJsSuggestions(cm, options) {
const cursor = cm.getCursor();
const token = cm.getTokenAt(cursor);
const line = cm.getLine(cursor.line);
const allLines = cm.getValue().split('\n');

const commonMethods = [
'console.log', 'document.querySelector', 'addEventListener',
'setTimeout', 'fetch', 'map', 'filter', 'reduce'
];
const commonSnippets = [
{
text: 'for (let i = 0; i < length; i++) {\n \n}',
displayText: 'for loop',
className: 'ai-snippet'
},
{
text: 'function name(params) {\n \n}',
displayText: 'function',
className: 'ai-snippet'
}
];

// Check if we're likely in a method chain
if (line.includes('.') && !token.string.includes('.')) {
return commonMethods.map(method => ({
text: method.replace(/^[^.]*\./, ''),
displayText: method,
className: 'ai-method'
}));
}

// Check for snippet opportunities
if (token.string.trim().length === 0) {
return commonSnippets;
}

return CodeMirror.hint.javascript(cm, options);
}


function updatePreview() {
const htmlCode = editors.html.getValue();
const cssCode = editors.css.getValue();
const jsCode = editors.js.getValue();
let errors = [];

// JS Error check
try {
new Function(jsCode);
} catch (e) {
errors.push("JavaScript Error: " + e.message);
}

// CSS Error check
const cssCheck = document.createElement('style');
try {
cssCheck.innerHTML = cssCode;
document.head.appendChild(cssCheck);
document.head.removeChild(cssCheck);
} catch (e) {
errors.push("CSS Error: " + e.message);
}

// HTML Error check
const parser = new DOMParser();
const parsedDoc = parser.parseFromString(htmlCode, "text/html");
const htmlErrors = parsedDoc.querySelectorAll("parsererror");
if (htmlErrors.length > 0) {
errors.push("HTML Error: " + htmlErrors[0].textContent);
}

document.getElementById("errorDisplay").innerText = errors.length > 0 ? errors.join('\n') : 'No errors.';

document.getElementById("preview").srcdoc = `
${htmlCode}
<style>${cssCode}</style>
<script>${jsCode}<\/script>
`;

// Save to localStorage
localStorage.setItem("code-html", htmlCode);
localStorage.setItem("code-css", cssCode);
localStorage.setItem("code-js", jsCode);
}

Object.values(editors).forEach(editor => {
editor.on("change", updatePreview);
});
Object.values(editors).forEach(editor => {
editor.on("keyup", function(cm, event) {
if (!cm.state.completionActive && !event.ctrlKey && !event.metaKey && !event.altKey) {
CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
}
});
});


function switchTab(event, tab) {
document.querySelectorAll('.editor-area').forEach(el => el.classList.remove('active'));
document.getElementById(tab).classList.add('active');

document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
event.target.classList.add('active');

editors[tab].refresh();
}



function clearEditors() {
Object.values(editors).forEach(editor => editor.setValue(''));
updatePreview();
}

function resetEditors() {
editors.html.setValue("<h1>Hello world!</h1>");
editors.css.setValue("body { font-family: Arial; }");
editors.js.setValue("console.log('Welcome to {P});)')");
updatePreview();
}
// Function for java page
function openJava(){
document.getElementById('openJavapage').addEventListener('click', () => {
window.location.href = "Java.html";
});
}
// Function for Python page
function openPython(){
document.getElementById('openPythonpage').addEventListener('click', () => {
window.location.href = "python.html";
});
}
//Function for Cpp page

function openCpp() {
document.getElementById('openCpppage').addEventListener('click', () => {
window.location.href = "Cpp.html";
});
}
function openCsharp() {
document.getElementById('openCsharppage').addEventListener('click', () => {
window.location.href = "Csharp.html";
});
}





window.onload = () => {
if (localStorage.getItem("theme") === "dark") {
document.body.classList.add("dark");
}
updatePreview();
emmetCodeMirror(editors.html); //emmet code mirror
setupAutocomplete();
};
//autosave in typing
let saveTimeout;
/*function debounceSave() {
clearTimeout(saveTimeout);
saveTimeout = setTimeout(updatePreview, 500); // waits 500ms after last keystroke
}*/
function setupAutocomplete() {
const debouncedAutocomplete = debounce(function(cm) {
if (!cm.state.completionActive) {
CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
}
}, 300);

// Set up keyup handlers for each editor
editors.html.on("keyup", function(cm, event) {
if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
debouncedAutocomplete(cm);
}
});

editors.css.on("keyup", function(cm, event) {
if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
debouncedAutocomplete(cm);
}
});

editors.js.on("keyup", function(cm, event) {
if (!event.ctrlKey && !event.metaKey && !event.altKey && event.key.length === 1) {
debouncedAutocomplete(cm);
}
});
}

// Update your editor onKeyUp events
Object.values(editors).forEach(editor => {
editor.on("keyup", debounce(function(cm, event) {
if (!cm.state.completionActive &&
!event.ctrlKey &&
!event.metaKey &&
!event.altKey &&
event.key.length === 1) { // Only for character keys
CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
}
}, 300));
});
//htmlEditor.on("change", debounceSave);
//cssEditor.on("change", debounceSave);
//jsEditor.on("change", debounceSave);


function openContactForm() {
document.getElementById('contactModal').classList.remove('hidden');
}

function closeContactForm() {
document.getElementById('contactModal').classList.add('hidden');
}

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
event.preventDefault();
alert('Thanks for contacting us! We will get back to you soon.');
closeContactForm();
// Add backend submission logic here if needed
});
function openContactForm() {
document.getElementById('contactModal').classList.remove('hidden');
}

function closeContactForm() {
document.getElementById('contactModal').classList.add('hidden');
}

// Handle form submission
// Update the submit handler to show loading state

document.getElementById('contactForm').addEventListener('submit', function(event) {
event.preventDefault();

if (!validateForm()) return;
console.log("Submit handler triggered!");

const loading = document.getElementById('formLoading');
const submitBtn = this.querySelector('button[type="submit"]');

// Show loading, disable submit button
loading.classList.remove('hidden');
submitBtn.disabled = true;

// Get form values
const name = this.querySelector('input[type="text"]').value;
const email = this.querySelector('input[type="email"]').value;
const message = this.querySelector('textarea').value;
window.db = db;

db.collection("contacts").add({
name: name,
email: email,
message: message,
timestamp: firebase.firestore.FieldValue.serverTimestamp()
})
.then(() => {
alert('Thank you for contacting us! We will get back to you soon.');
closeContactForm();
this.reset();
})
.catch((error) => {
console.error("Error adding document: ", error);
alert('There was an error submitting your message. Please try again later.');
})
.finally(() => {
loading.classList.add('hidden');
submitBtn.disabled = false;
});
});
document.getElementById('testWrite').addEventListener('click', () => {
  if (!window.db) return alert('Firestore not initialized');
  window.db.collection('contacts').add({
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => alert('Write success'))
  .catch(e => alert('Write error: ' + e.message));
});


document.querySelectorAll('.tab-button').forEach(button => {
button.addEventListener('click', function () {
const tab = this.getAttribute('data-tab');

// Hide all editors
document.querySelectorAll('.editor').forEach(el => el.classList.add('hidden'));

// Show the selected editor
document.getElementById(`${tab}-editor`).classList.remove('hidden');

// Remove active class from all buttons
document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));

// Add active class to clicked button
this.classList.add('active');
});
});