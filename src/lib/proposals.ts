export const fetchSnapshotProposals = async (daoAddress: string) => {
  try {
    const response = await fetch(`/api/proposals?daoAddress=${daoAddress}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }
};
