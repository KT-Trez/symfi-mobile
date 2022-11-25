import React from 'react';
import {Button, Dialog, Paragraph, Portal, useTheme} from 'react-native-paper';


interface ManageDialogProps {
	hide: () => void;
	isVisible: boolean;
	message?: string;
	onCancel: () => void;
	onDelete?: () => void;
	onEdit?: () => void;
	title?: string;
	resourceName?: string;
}

function ManageDialog({hide, isVisible, message, onCancel, onEdit, onDelete, resourceName, title}: ManageDialogProps) {
	const {colors} = useTheme();

	return (
		<Portal>
			<Dialog dismissable={true} onDismiss={hide} visible={isVisible}>
				<Dialog.Title>{title ?? 'Manage'}</Dialog.Title>
				<Dialog.Content>
					<Paragraph>{message ?? `Do you want to delete/edit this ${resourceName}?`}</Paragraph>
				</Dialog.Content>
				<Dialog.Actions>
					{onDelete &&
                        <Button icon={'delete-forever'}
                                onPress={onDelete}
                                textColor={colors.error}>delete</Button>
					}
					{onEdit &&
                        <Button onPress={onEdit}>edit</Button>
					}
					<Button onPress={onCancel}>cancel</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}

export default ManageDialog;