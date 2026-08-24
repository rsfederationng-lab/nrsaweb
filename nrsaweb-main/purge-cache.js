// Emergency cache purge - add unique query to force refresh
const timestamp = Date.now();
console.log(`Cache purge timestamp: ${timestamp}`);
console.log(`Try accessing: https://nrsa.com.ng/?cb=${timestamp}`);
console.log(`Or: https://nrsa.com.ng/?v=${timestamp}&nocache=1`);