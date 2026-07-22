import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import type { RoleOut } from '@redhat-cloud-services/rbac-client';
import { useDeleteRoleMutation } from '../data/queries/roles';

interface DeleteRoleModalProps {
  role: RoleOut | null;
  onClose: () => void;
}

export const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  role,
  onClose,
}) => {
  const deleteMutation = useDeleteRoleMutation();

  const handleDelete = () => {
    if (!role) return;
    deleteMutation.mutate(role.uuid, { onSuccess: onClose });
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={role !== null}
      onClose={onClose}
      aria-label="Delete role"
    >
      <ModalHeader title="Delete role" titleIconVariant="warning" />
      <ModalBody>
        Are you sure you want to delete{' '}
        <strong>{role?.display_name || role?.name}</strong>? This action cannot
        be undone.
      </ModalBody>
      <ModalFooter>
        <Button
          variant="danger"
          onClick={handleDelete}
          isDisabled={deleteMutation.isPending}
          isLoading={deleteMutation.isPending}
        >
          Delete
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
