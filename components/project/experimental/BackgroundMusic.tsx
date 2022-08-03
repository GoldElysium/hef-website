import { useCallback, useState } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

export interface ProjectBackgroundMusicProps {
	backgroundMusic: string,
}

// TODO: Themes?

export function ProjectBackgroundMusic({ backgroundMusic }: ProjectBackgroundMusicProps) {
	const [muted, setMuted] = useState(false); 
	const [volume, setVolume] = useState(0.125);

	const audio = useCallback((audioDeez: HTMLAudioElement | null) => {
		if (audioDeez != null) {
			audioDeez.volume = volume;
		}
	}, [ volume ]);

	return (
		<>
			<audio
				ref={audio}
				autoPlay={true}
				controls={false}
				loop={true}
				muted={muted}>
				<source src={backgroundMusic} type="audio/mp3"></source>
			</audio>
			<Card className="fixed bottom-4 left-4 z-50">
				<div className="relative left-3 w-64 h-16 flex justify-center items-center">
					<Grid container spacing={1}>
						<Grid item xs={2}>
							<IconButton onClick={() => setMuted(!muted)}>
								{!muted && (<VolumeUpIcon/>) || (<VolumeOffIcon/>)}
							</IconButton>
						</Grid>
						<Grid item xs={8} sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
							<Slider
								disabled={muted}
								max={1}
								min={0}
								step={0.05}
								value={volume}
								onChange={(_, value) => setVolume(value as number)}
							/>
						</Grid>
					</Grid>
				</div>
			</Card>
		</>
	);
}

export default ProjectBackgroundMusic;
