import styled from 'styled-components';

interface Props {
  showNav: boolean;
  showRoster: boolean;
}

export const StyledLayout = styled.main<Props>`
  height: 100vh;
  width: 100%;

  display: grid;

  .video-content {
    grid-area: content;
  }

  ${({ showNav, showRoster }) => {
      return `
        grid-template-columns: 20fr 1fr;
        grid-template-areas: 'content roster';
      `;
  }}

  .nav {
    grid-area: nav;
    height: 90%;
  }

  .roster {
    grid-area: roster;
    z-index: 2;
    height: 90%;
  }

  @media screen and (min-width: 769px) {
    .mobile-toggle {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas: 'content';

    .nav {
      grid-area: unset;
      position: fixed;
    }

    .roster {
      grid-area: unset;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      max-width: 320px;
    }
  }

  @media screen and (max-width: 460px) {
    .roster {
      max-width: 100%;
    }
  }
`;

/* .controls for changing the box that has mute/camera/etc
 * .controls-menu for changing the stuff inside it
 * Where they are defined: https://github.com/aws/amazon-chime-sdk-component-library-react/blob/551f58a6f6f9b2c0176a56003fc94bd73fe3d87e/demo/meeting/src/containers/MeetingControls/index.tsx
 */
export const StyledContent = styled.div`
  position: relative;
  grid-area: content;
  height: 90%;
  display: flex;
  flex-direction: column;

  .videos {
    flex: 1;
  }

  .controls {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  @media screen and (max-width: 768px) {
    .controls {
      position: static;
      transform: unset;
    }
  }
`;
