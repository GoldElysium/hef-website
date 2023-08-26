declare module 'phaser/src/device/OS' {
	interface OSType {
		desktop: boolean;
		iOS: boolean;
		iPad: boolean;
	}

	const OS: OSType;

	export default OS;
}
