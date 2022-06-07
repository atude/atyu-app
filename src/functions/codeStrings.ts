export const createCodeFunctionPrefix = () => `
#include "render_gif.h"
#include "satisfaction75.h"
#include <stdio.h>

#define DEFAULT_ANIM_SIZE 512
#define ANIM_GIF_SPEED 100

#ifdef OLED_ENABLE

uint32_t gif_anim_timer = 0;

void draw_gif() {
`;

export const createCodePrefix = (curr_gif: number, frames_length: number) => `
	// GIF ${curr_gif}
	static uint8_t gif_${curr_gif}_curr_frame = 0;
	static const char PROGMEM gif_${curr_gif}[${frames_length}][DEFAULT_ANIM_SIZE] = {
`;

export const createCodeSuffix = (curr_gif: number, frames_length: number) => `
	};

	void animate_gif_${curr_gif}(void) {
		oled_write_raw_P(gif_${curr_gif}[gif_${curr_gif}_curr_frame], DEFAULT_ANIM_SIZE);
		gif_${curr_gif}_curr_frame = gif_${curr_gif}_curr_frame + 1;
		if (gif_${curr_gif}_curr_frame >= ${frames_length}) {
				gif_${curr_gif}_curr_frame = 0;
		}
	}
`;

export const createCodeFunctionSuffix = (length: number) => `
	if (timer_elapsed32(gif_anim_timer) > ANIM_GIF_SPEED) {
		gif_anim_timer = timer_read32();
		if (gif_mode == 0) {
				animate_gif_1();
		} else if (gif_mode == 1) {
				animate_gif_${length > 1 ? 2 : 1}();
		} else {
				animate_gif_${length > 2 ? 3 : 1}();
		}
	}
}

#endif
`;