function timescale(duration){
	let dur = {hours:0,minutes:0,seconds:0};
	dur.seconds = Math.floor(duration / 1000);
	if(dur.seconds<60) return `${dur.seconds}s`;
	dur.minutes = Math.floor(dur.seconds/60);
	dur.seconds -= dur.minutes*60;
	if(dur.minutes<60) return `${dur.minutes}m${dur.seconds}s`;
	dur.hours = Math.floor(dur.minutes/60);
	dur.minutes -= dur.hours*60;
	return `${dur.hours}h${dur.minutes}m${dur.seconds}s`;
}

module.exports = timescale;