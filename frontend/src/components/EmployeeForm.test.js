
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import { getOrganizationStructure } from '../services/organizationService';
import { getJobTemplatesByDirection, getJobTemplatesByService, getJobTemplatesByDivision } from '../services/jobTemplateService';

// Mock services
jest.mock('../services/organizationService', () => ({
  getOrganizationStructure: jest.fn()
}));

jest.mock('../services/jobTemplateService', () => ({
  getJobTemplatesByDirection: jest.fn(),
  getJobTemplatesByService: jest.fn(),
  getJobTemplatesByDivision: jest.fn()
}));

jest.mock('../services/employeeService');
jest.mock('../utils/notificationService');

// Mock useParams and useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({}),
  useNavigate: () => jest.fn(),
}));

describe('EmployeeForm Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    getOrganizationStructure.mockResolvedValue([]);
    getJobTemplatesByDirection.mockResolvedValue([]);
    getJobTemplatesByService.mockResolvedValue([]);
    getJobTemplatesByDivision.mockResolvedValue([]);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <EmployeeForm />
      </BrowserRouter>
    );
  };

  test('should validate step 0 before moving to step 1', async () => {
    renderComponent();

    // Wait for loader to disappear and fields to appear
    await screen.findByLabelText(/Prénom/i);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    // Click Next without filling required fields
    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);

    // Should stay on Step 0 and show errors
    await waitFor(() => {
      expect(screen.getByText(/Le prénom est requis/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    });

    // Fill required fields for Step 0
    fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/^Nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    
    // Select Gender (Material UI Select)
    const genderSelect = screen.getByLabelText(/Genre/i);
    fireEvent.mouseDown(genderSelect);
    const maleOption = await screen.findByRole('option', { name: /Homme/i });
    fireEvent.click(maleOption);

    // Date of Birth
    fireEvent.change(screen.getByLabelText(/Date de Naissance/i), { target: { value: '1990-01-01' } });
    
    // Manually fill age to ensure it's set (validation requires it)
    fireEvent.change(screen.getByLabelText(/Âge/i), { target: { value: '33' } });

    // Click Next
    fireEvent.click(nextButton);

    // Should move to Step 1 (Informations Professionnelles)
    await waitFor(() => {
      expect(screen.getByText(/Titre du poste/i)).toBeInTheDocument();
    });
  });

  test('should allow going back from step 1 to step 0', async () => {
    renderComponent();

    await screen.findByLabelText(/Prénom/i);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

    // Fill Step 0 to proceed
    fireEvent.change(screen.getByLabelText(/Prénom/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/^Nom/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john.doe@example.com' } });
    
    const genderSelect = screen.getByLabelText(/Genre/i);
    fireEvent.mouseDown(genderSelect);
    const maleOption = await screen.findByRole('option', { name: /Homme/i });
    fireEvent.click(maleOption);

    fireEvent.change(screen.getByLabelText(/Date de Naissance/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/Âge/i), { target: { value: '33' } });

    const nextButton = screen.getByRole('button', { name: /Suivant/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
        expect(screen.getByText(/Titre du poste/i)).toBeInTheDocument();
    });

    // Click Back
    const backButton = screen.getByRole('button', { name: /Retour/i });
    fireEvent.click(backButton);

    // Should be back on Step 0
    await waitFor(() => {
        expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    });
  });
});
