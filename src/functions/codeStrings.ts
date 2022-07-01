export const createCodeFunctionPrefix = () => `
#include "render_gif.h"
#include "satisfaction75.h"
#include <stdio.h>

#define DEFAULT_ANIM_SIZE 512
#define ANIM_GIF_SPEED 100

#ifdef OLED_ENABLE

uint32_t gif_anim_timer = 0;
`;

export const createCodePrefix = (curr_gif: number, frames_length: number) => `
bool draw_gif_${curr_gif}() {
	static uint8_t gif_curr_frame = 0;
	static const char PROGMEM gif[${frames_length}][DEFAULT_ANIM_SIZE] = {
`;

export const createCodeSuffix = (curr_gif: number, frames_length: number) => `
	};

	void animate_gif(void) {
		oled_write_raw_P(gif[gif_curr_frame], DEFAULT_ANIM_SIZE);
		gif_curr_frame = gif_curr_frame + 1;
		if (gif_curr_frame >= ${frames_length}) {
				gif_curr_frame = 0;
		}
	}

	if (timer_elapsed32(gif_anim_timer) > ANIM_GIF_SPEED) {
		gif_anim_timer = timer_read32();
		animate_gif();
	}

	return true;
}
`;

export const createNoGifFunction = (curr_gif: number) => `
bool draw_gif_${curr_gif}() { return false; }
`;

export const createCodeFunctionSuffix = () => `
#endif
`;