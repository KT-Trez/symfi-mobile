import React from 'react';
import {Button, Dialog, Paragraph, Portal} from 'react-native-paper';


interface ManageDialogProps {
	hide: () => void;
	isVisible: boolean;
	name: string;
	onCancel: () => void;
	onDelete: () => void;
	onEdit: () => void;
}

function ManageDialog({hide, isVisible, name, onCancel, onEdit, onDelete}: ManageDialogProps) {
	return (
		<Portal>
			<Dialog dismissable={true} onDismiss={hide} visible={isVisible}>
				<Dialog.Title>Manage</Dialog.Title>
				<Dialog.Content>
					<Paragraph>Do you want to delete/edit this {name}?</Paragraph>
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