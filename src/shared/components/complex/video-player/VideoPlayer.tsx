import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

type VideoPlayerProps = {
  source: string;
  width: number;
  height: number
};

export default function VideoPlayer({ source, width, height }: VideoPlayerProps) {

  const player = useVideoPlayer(source, player => {
    player.loop = true;
  });

  return (
    <View style={styles.contentContainer}>
      <VideoView
        style={{
          width: width,
          height: height
        }}
        player={player}
        fullscreenOptions={{ enable: true }}
        allowsPictureInPicture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});