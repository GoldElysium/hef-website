import { FileUpload } from '@tripetto/block-file-upload/runner';
import { IFormNodeBlock, IFormNodeBlockProps } from '@/components/ui/form/FormRunner';
import { FileFabric } from '@tripetto/runner-fabric/components/file';
import { tripetto } from '@tripetto/runner';

@tripetto({
	legacyBlock: true,
	type: 'node',
	identifier: '@tripetto/block-file-upload',
})
export default class UploadBlock extends FileUpload implements IFormNodeBlock {
	render(props: IFormNodeBlockProps) {
		return (
			<>
				{props.name}
				{props.description}
				<FileFabric
					styles={{
						backgroundColor: '#fff',
						borderColor: 'inherit',
						errorColor: '#f00',
						textColor: '#000',
					}}
					controller={this}
					service={props.attachments}
					error={props.isFailed}
					tabIndex={props.tabIndex}
					ariaDescribedBy={props.ariaDescribedBy}
					onAutoFocus={props.autoFocus}
					onFocus={props.focus as any}
					onBlur={props.blur as any}
					onSubmit={props.onSubmit}
					labels={(id, message) => {
						switch (id) {
							case 'explanation':
								return 'Choose or drag a file here';
							case 'dragging':
								return 'Drop your file now';
							case 'limit':
								return `Size limit: ${message}`;
							case 'extensions':
								return `Allowed extensions: ${message}`;
							case 'retry':
								return 'Try again';
							case 'progress':
								return `Uploading (${message})`;
							case 'delete':
								return 'Delete';
							case 'invalid-file':
								return "This file can't be used.";
							case 'invalid-amount':
								return 'Too many files selected.';
							case 'invalid-extension':
								return 'Extension is not allowed.';
							case 'invalid-size':
								return 'File size is too large.';
							case 'error':
								return `Something went wrong while uploading${(message && ` (${message})`) || ''}`;
							default:
								return message;
						}
					}}
				/>
				{props.ariaDescription}
			</>
		);
	}
}
