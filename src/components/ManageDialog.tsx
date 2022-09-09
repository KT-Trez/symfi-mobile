import React from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';


interface ManageDialogProps {
	hide: () => void;
	isVisible: boolean;
	onCancel: () => void;
	onDelete: () => void;
	onEdit: () => void;
	resourceName: string;
}

function ManageDialog({hide, isVisible, onCancel, onEdit, onDelete, resourceName}: ManageDialogProps) {
	return (
		<Portal>
			<Dialog dismissable={true} onDismiss={hide} visible={isVisible}>
				<Dialog.Title>Manage</Dialog.Title>
				<Dialog.Content>
					<Paragraph>Do you want to delete/edit this {resourceName}?</Paragraph>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={onCancel}>Cancel</Button>
					<Button onPress={onDelete}>Delete</Button>
					<Button onPress={onEdit}>Edit</Button>
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
}

export default ManageDialog;