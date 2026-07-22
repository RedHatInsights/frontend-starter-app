import React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
  TextArea,
  TextInput,
} from '@patternfly/react-core';

export interface RoleFormData {
  name: string;
  displayName: string;
  description: string;
}

interface DetailsStepProps {
  formData: RoleFormData;
  onChange: (data: RoleFormData) => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  formData,
  onChange,
}) => (
  <Form>
    <FormGroup label="Name" isRequired fieldId="role-name">
      <TextInput
        id="role-name"
        isRequired
        value={formData.name}
        onChange={(_e, val) => onChange({ ...formData, name: val })}
        aria-label="Role name"
      />
    </FormGroup>
    <FormGroup label="Display name" fieldId="role-display-name">
      <TextInput
        id="role-display-name"
        value={formData.displayName}
        onChange={(_e, val) => onChange({ ...formData, displayName: val })}
        aria-label="Role display name"
      />
    </FormGroup>
    <FormGroup label="Description" fieldId="role-description">
      <TextArea
        id="role-description"
        value={formData.description}
        onChange={(_e, val) => onChange({ ...formData, description: val })}
        aria-label="Role description"
      />
    </FormGroup>
  </Form>
);

interface ReviewStepProps {
  formData: RoleFormData;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => (
  <DescriptionList>
    <DescriptionListGroup>
      <DescriptionListTerm>Name</DescriptionListTerm>
      <DescriptionListDescription>
        {formData.name || '—'}
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Display name</DescriptionListTerm>
      <DescriptionListDescription>
        {formData.displayName || '—'}
      </DescriptionListDescription>
    </DescriptionListGroup>
    <DescriptionListGroup>
      <DescriptionListTerm>Description</DescriptionListTerm>
      <DescriptionListDescription>
        {formData.description || '—'}
      </DescriptionListDescription>
    </DescriptionListGroup>
  </DescriptionList>
);
