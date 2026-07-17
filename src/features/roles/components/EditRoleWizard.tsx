import React, { useEffect, useState } from 'react';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
  Modal,
  ModalVariant,
  Spinner,
  Wizard,
  WizardStep,
} from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import { useAppNavigate } from '../../../hooks/useAppNavigate';
import { useRoleQuery, useUpdateRoleMutation } from '../data/queries/roles';
import { DetailsStep, ReviewStep, type RoleFormData } from './RoleWizardBody';

export const EditRoleWizard: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useAppNavigate();
  const roleQuery = useRoleQuery(uuid!);
  const updateMutation = useUpdateRoleMutation();
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    displayName: '',
    description: '',
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (roleQuery.data && !initialized) {
      setFormData({
        name: roleQuery.data.name,
        displayName: roleQuery.data.display_name || '',
        description: roleQuery.data.description || '',
      });
      setInitialized(true);
    }
  }, [roleQuery.data, initialized]);

  const onClose = () => navigate('/roles');

  const onSubmit = () => {
    updateMutation.mutate(
      {
        uuid: uuid!,
        name: formData.name,
        display_name: formData.displayName || formData.name,
        description: formData.description,
      },
      { onSuccess: onClose },
    );
  };

  const renderContent = () => {
    if (roleQuery.isLoading) {
      return (
        <Bullseye style={{ padding: '4rem' }}>
          <Spinner />
        </Bullseye>
      );
    }

    if (roleQuery.error) {
      return (
        <Bullseye style={{ padding: '4rem' }}>
          <EmptyState
            variant={EmptyStateVariant.sm}
            titleText="Unable to load role"
          >
            <EmptyStateBody>
              {roleQuery.error.message || 'An unexpected error occurred.'}
            </EmptyStateBody>
            <EmptyStateFooter>
              <Button variant="link" onClick={onClose}>
                Go back
              </Button>
            </EmptyStateFooter>
          </EmptyState>
        </Bullseye>
      );
    }

    return (
      <Wizard title="Edit role" onClose={onClose} onSave={onSubmit}>
        <WizardStep name="Details" id="details">
          <DetailsStep formData={formData} onChange={setFormData} />
        </WizardStep>
        <WizardStep
          name="Review"
          id="review"
          footer={{
            nextButtonText: 'Save',
            isNextDisabled: !formData.name.trim() || updateMutation.isPending,
          }}
        >
          <ReviewStep formData={formData} />
        </WizardStep>
      </Wizard>
    );
  };

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen
      onClose={onClose}
      aria-label="Edit role"
    >
      {renderContent()}
    </Modal>
  );
};

export default EditRoleWizard;
