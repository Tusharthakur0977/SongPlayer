import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
const ControlCenter = () => {
  const playBackState = usePlaybackState();
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const [originalPlaylist, setOriginalPlaylist] = useState([]);
  useEffect(() => {
    const fetchPlaylist = async () => {
      const queue = await TrackPlayer.getQueue();
      setOriginalPlaylist(queue);
    };
    fetchPlaylist();
  }, []);

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
  };
  const previousButton = async () => {
    await TrackPlayer.skipToPrevious();
  };
  const controlPlaynPause = async (playBack: State) => {
    const currentTrack = await TrackPlayer.getActiveTrack();
    if (currentTrack != null) {
      if (playBack === State.Paused || playBack === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  const toggleShuffle = async () => {
    setIsShuffleEnabled(!isShuffleEnabled);
    if (!isShuffleEnabled) {
      const queue = await TrackPlayer.getQueue();
      let shuffled = queue.sort(() => 0.5 - Math.random());

      await TrackPlayer.reset();
      await TrackPlayer.add(shuffled);
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.reset();
      await TrackPlayer.add(originalPlaylist);
      await TrackPlayer.pause();
    }
  };

  return (
    <View style={styles.container}>
      {/* test */}
      <Pressable onPress={skipToNext}>
        <Icon
          style={(styles.icon, {marginLeft: 50})}
          name="playlist-add"
          size={50}
        />
      </Pressable>
      <Pressable onPress={previousButton}>
        <Icon style={styles.icon} name="skip-previous" size={50} />
      </Pressable>
      <Pressable onPress={() => controlPlaynPause(playBackState.state)}>
        <Icon
          style={(styles.icon, {marginLeft: 10})}
          name={playBackState.state === State.Playing ? 'pause' : 'play-arrow'}
          size={75}
        />
      </Pressable>
      <Pressable onPress={skipToNext}>
        <Icon style={styles.icon} name="skip-next" size={50} />
      </Pressable>
      {/* test */}
      <Pressable onPress={toggleShuffle}>
        <Icon
          style={(styles.icon, {marginRight: 50})}
          name="shuffle"
          size={45}
          color={isShuffleEnabled ? 'red' : 'wheat'}
        />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: 56,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: 'wheat',
    width: 70,
    marginLeft: 30,
  },
  playButton: {
    marginHorizontal: 44,
  },
});
export default ControlCenter;
