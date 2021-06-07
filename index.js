$( document ).ready(function() {
    console.log( "ready!" );
    //attach a click listener to a play button
    document.getElementById('playButtonId').addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now()
    // synth.triggerAttack("D4", now);
    // synth.triggerAttack("F4", now + 0.5);
    // synth.triggerAttack("A4", now + 1);
    // synth.triggerAttack("C5", now + 1.5);
    // synth.triggerAttack("E5", now + 2);
    // synth.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 4);
    bigGen(synth, now);
})
});

const bachFlow = {
    "1" : ["1","2","3","4","5","6","7"],
    "2" : ["5","7"],
    "3" : ["6", "4", "2"],
    "4" : ["5","2","7", "1"],
    "5" : ["1", "6"],
    "6" : ["4", "2"],
    "7" : ["1", "6"]
}

const majorScale = {
    "Cb": ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"],
    "Gb" : ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"],
    "Db" : ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"],
    "Ab" : ["Ab", "Bb", "C", "Db", "Eb", "F", "G"],
    "Eb" : ["Eb", "F", "G", "Ab", "Bb", "C", "D"],
    "Bb" : ["Bb", "C", "D", "Eb", "F", "G", "A"],
    "F" : ["F", "G", "A","Bb", "C", "D", "B"],
    "C" : ["C", "D", "E", "F", "G", "A", "B"],
    "G" : ["G", "A", "B", "C", "D", "E", "F#"],
    "D" : ["D", "E", "F#", "G", "A", "B", "C#"],
    "A" : ["A", "B", "C#", "D", "E", "F#", "G#"],
    "E" : ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "B" : ["B", "C#", "D#", "E", "F#", "G#", "A#"],
    "F#" : ["F#", "G#", "A#","B", "C#", "D#", "B#"],
    "C#" : ["C#", "D#", "E#", "F#", "G#", "A#", "B#"]
}
const majorScaleByNumberEncode = {
    "Cb": {
        "1": "Cb",
        "2": "Db",
        "3": "Eb",
        "4": "Fb",
        "5": "Gb",
        "6": "Ab",
        "7": "Bb"
    },
    "Gb" : {"1": "Gb","2": "Ab","3": "Bb","4": "Cb","5": "Db","6": "Eb","7": "F"},
    "Db" : {"1": "Db","2": "Eb","3": "F","4": "Gb","5": "Ab","6": "Bb","7": "C"},
    "Ab" : {"1": "Ab","2": "Bb","3": "C","4": "Db","5": "Eb","6": "F","7": "G"},
    "Eb" : {"1": "Eb","2": "F","3": "G","4": "Ab","5": "Bb","6": "C", "7": "D"},
    "Bb" : {"1": "Bb","2": "C","3": "D","4": "Eb","5": "F","6": "G","7": "A"},
    "F" : {"1": "F","2": "G", "3": "A", "4": "Bb","5": "C","6": "D", "7": "B"},
    "C" : {"1": "C","2": "D","3": "E","4": "F","5": "G","6": "A","7": "B"},
    "G" : {"1": "G","2": "A","3": "B","4": "C","5": "D","6": "E","7": "F#"},
    "D" : {"1": "D","2": "E","3": "F#","4": "G","5": "A","5": "B","7": "C#"},
    "A" : {"1": "A","2": "B","3": "C#","4": "D","5": "E","6": "F#","7": "G#"},
    "E" : {"1": "E","2": "F#","3": "G#","4": "A","5": "B","6": "C#","7": "D#"},
    "B" : {"1": "B","2": "C#","3": "D#","4": "E","5": "F#","6": "G#","7": "A#"},
    "F#" : {"1": "F#","2": "G#","3": "A#","4": "B","5": "C#","6": "D#","7": "B#"},
    "C#" : {"1": "C#","2": "D#","3": "E#","4": "F#","5": "G#","6": "A#","7": "B#"}
}

const majorScaleByNumberDecode = {
    "Cb": {
        "Cb": "1",
        "Db": "2",
        "Eb" : "3",
        "Fb" : "4",
        "Gb": "5",
        "Ab": "6",
        "Bb": "7"
    },
    "Gb" : {"Gb": "1","Ab" :"2", "Bb" :"3", "Cb": "4", "Db": "5","Eb": "6","F": "7"},
    "Db" : {"Db": "1","Eb": "2","F": "3","Gb":"4", "Ab": "5","Bb": "6","C" : "7"},
    "Ab" : {"Ab": "1","Bb":"2", "C" :"3","Db" :"4", "Eb" :"5","F" :"6","G": "7"},
    "Eb" : {"Eb": "1","F": "2","G" : "3","Ab" : "4","Bb": "5","C" : "6", "D": "7"},
    "Bb" : {"Bb": "1","C": "2","D": "3","Eb": "4","F": "5","G" : "6","A": "7"},
    "F" : {"F": "1","G": "2","A": "3","Bb" : "4","C": "5","D": "6","B": "7"},
    "C" : {"C": "1","D": "2","E": "3", "F": "4", "G": "5","A": "6","B": "7"},
    "G" : {"G": "1","A": "2","B": "3","C": "4","D": "5","E": "6","F#": "7"},
    "D" : {"D": "1", "E": "2","F#": "3","G": "4","A": "5","B": "6","C#": "7"},
    "A" : {"A": "1","B": "2","C#": "3","D": "4","E": "5","F#": "6","G#": "7"},
    "E" : {"E": "1","F#": "2","G#": "3","A": "4","B": "5","C#": "6","D#": "7"},
    "B" : {"B": "1","C#": "2","D#": "3", "E": "4","F#": "5", "G#":"6","A#": "7"},
    "F#" : {"F#": "1","G#": "2","A#": "3","B": "4","C#": "5","D#": "6","B#": "7"},
    "C#" : {"C#": "1","D#": "2","E#": "3","F#": "4","G#": "5","A#": "6","B#": "7"}
}

function bigGen(synth, now){
    // create object to hold the composition
    var composition = {};
    // pick a songwrite func
    //  Are we using bachFlow? Are we using Western scales?
    var method = getRandomInt(0,1);
    if (method >= 0 && method < 1){
        //two voices
        composition = twoVoices(synth, now, "F#","1","1", "8n", 2, 2);
    }
    // get ready to record and perform composition
    perform(composition, synth, now)
}

function perform(composition, synth, now){

}

function twoVoices(synth, now, key, thisNoteA, thisNoteB, noteValueA, noteValueB, noteOffsetA, noteOffsetB){
    // Notes are expressed as Numberics under in a given key
    // 
    console.log("key: " + key +", " + thisNoteA + "," + noteValueA + ", " + thisNoteB +","+ noteValueB);
    var playableNoteA = majorScaleByNumberEncode[key][thisNoteA];
    var playableNoteB = majorScaleByNumberEncode[key][thisNoteB];
    synth.triggerAttackRelease(playableNoteA + "5", noteValueA, now + noteOffsetA);
    synth.triggerAttackRelease(playableNoteB + "4", noteValueB, now + noteOffsetB);

    // go find next notes
    var noteA = bachFlow[thisNoteA][getRandomInt(0,bachFlow[thisNoteA].length)];
    var noteB = bachFlow[thisNoteB][getRandomInt(0,bachFlow[thisNoteB].length)];
    //console.log(bachFlow[thisNoteA]+ " , " + bachFlow[thisNoteB] + " ::: " + noteA + " : " + noteB);
    //recurse or end
    console.log("key: " + key +", " + noteA + "," + noteValueA + ", " + noteB +","+ noteValueB);
    if(noteB == "1"){
        return;
    } else {
        twoVoices(synth, now, key, noteA, noteB, noteValueA, noteValueB, noteOffsetA + 2, noteOffsetB + 2);
    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}