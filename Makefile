-include .env
export

start:
	PORT=3000 npm run start:dev

test-performance:
	cat test/performance/attack.txt | vegeta attack -duration 1s | vegeta report -type=hdrplot