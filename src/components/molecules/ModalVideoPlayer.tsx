'use client';

import 'media-chrome';
import {
    MediaController,
    MediaControlBar,
    MediaTimeRange,
    MediaTimeDisplay,
    MediaVolumeRange,
    MediaPlayButton,
    MediaMuteButton,
    MediaFullscreenButton,
} from 'media-chrome/react';
import styled from '@emotion/styled';

interface ModalVideoPlayerProps {
    src: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    showControls?: boolean;
}

const StyledController = styled(MediaController)`
  --media-primary-color: white;
  display: grid !important;
  grid-template-rows: 1fr auto !important;
  width: 100% !important;
  height: 100% !important;
  background: transparent;
  box-sizing: border-box;
`;

const StyledControlBar = styled(MediaControlBar)`
  grid-row: 2 !important;
  width: 100% !important;
  background: rgba(0, 0, 0, 0.6) !important;
  padding: 0 var(--size-4) !important;
`;

const StyledVideo = styled.video`
  width: 100% !important;
  height: 100% !important;
  grid-row: 1 !important;
  display: block !important;
  object-fit: contain !important;
`;

export function ModalVideoPlayer({
    src,
    autoPlay = true,
    muted = false,
    loop = false,
    showControls = true,
}: ModalVideoPlayerProps) {
    return (
        <StyledController
            hotkeys="noarrowleft noarrowright"
            defaultSubtitles
        >
            <StyledVideo
                slot="media"
                src={src}
                playsInline
                autoPlay={autoPlay}
                preload="auto"
                muted={muted}
                loop={loop}
                crossOrigin=""
                suppressHydrationWarning={true}
            />
            {showControls && (
                <StyledControlBar
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    <MediaPlayButton mediaPaused={!autoPlay}></MediaPlayButton>
                    <MediaTimeRange></MediaTimeRange>
                    <MediaTimeDisplay showDuration></MediaTimeDisplay>
                    <MediaMuteButton mediaVolumeLevel={muted ? 'off' : 'high'}></MediaMuteButton>
                    <MediaVolumeRange></MediaVolumeRange>
                    <MediaFullscreenButton></MediaFullscreenButton>
                </StyledControlBar>
            )}
        </StyledController>
    );
}
