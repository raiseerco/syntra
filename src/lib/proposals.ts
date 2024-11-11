export const fetchAllProposals = async (
  daoAddress: string,
  tallyOrgId: string,
) => {
  try {
    const response = await fetch(
      `/api/proposals?daoAddress=${daoAddress}&organizationId=${tallyOrgId}`,
    );
    if (!response.ok) {
      console.log('responseeee', response);
      throw Error(`HTTP status error: ${response.statusText}`);
    }

    console.log('responseOK', response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('---> Error fetching proposals:', error);
    throw error;
  }
};
