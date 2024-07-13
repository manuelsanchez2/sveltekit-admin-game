import { debounce, highlightMatch } from '$utils';
import { describe, it, expect, vi, vitest } from 'vitest';

describe('Function highlightMatch', () => {
	it('should highlight the matched term in the text', () => {
		const result = highlightMatch('Game of Thrones', 'game');
		expect(result).toBe('<span class="bg-yellow-300">Game</span> of Thrones');

		const result2 = highlightMatch('game of Thrones', 'Game');
		expect(result2).toBe('<span class="bg-yellow-300">game</span> of Thrones');

		const result3 = highlightMatch(123456, '234');
		expect(result3).toBe('1<span class="bg-yellow-300">234</span>56');
	});
});

describe('Function debounce', () => {
	it('should delay the execution of the function', () => {
		vitest.useFakeTimers();
		const func = vi.fn();
		const debouncedFunc = debounce(func, 300);

		debouncedFunc();
		expect(func).not.toHaveBeenCalled();

		vitest.advanceTimersByTime(300);
		expect(func).toHaveBeenCalledTimes(1);

		vitest.useRealTimers();
	});
});
