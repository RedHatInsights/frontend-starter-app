import React, { useState } from 'react';
import {
  Modal,
  ModalVariant,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { useAppNavigate } from '../../../hooks/useAppNavigate';
import { useCreateRoleMutation } from '../data/queries/roles';
import { DetailsStep, ReviewStep, type RoleFormData } from './RoleWizardBody';

const EMPTY_FORM: RoleFormData = { name: '', displayName: '', description: '' };

export const CreateRoleWizard: React.FC = () => {
  const navigate = useAppNavigate();
  const createMutation = useCreateRoleMutation();
  const [formData, setFormData] = useState<RoleFormData>(EMPTY_FORM);

  const onClose = () => navigate('/roles');

  const onSubmit = () => {
    createMutation.mutate(
      {
        name: formData.name,
        display_name: formData.displayName || formData.name,
        description: formData.description,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen
      onClose={onClose}
      aria-label="Create role"
    >
      <Wizard title="Create role" onClose={onClose} onSave={onSubmit}>
        <WizardStep name="Details" id="details">
          <DetailsStep formData={formData} onChange={setFormData} />
        </WizardStep>
        <WizardStep
          name="Review"
          id="review"
          footer={{
            nextButtonText: 'Create',
            isNextDisabled: !formData.name.trim() || createMutation.isPending,
          }}
        >
          <ReviewStep formData={formData} />
        </WizardStep>
      </Wizard>
    </Modal>
  );
};

export default CreateRoleWizard;
