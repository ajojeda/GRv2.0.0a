import { usePermissions } from '../context/PermissionsContext';

export default function SiteSwitcher() {
  const { user, siteAccess, selectedSiteId, setSelectedSiteId } = usePermissions();

  if (!user?.allSites || !siteAccess?.length || user?.sysAdmin) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="siteSwitcher" className="font-medium">Site:</label>
      <select
        id="siteSwitcher"
        className="border rounded px-2 py-1"
        value={selectedSiteId}
        onChange={(e) => setSelectedSiteId(Number(e.target.value))}
      >
        {siteAccess.map((siteId) => (
          <option key={siteId} value={siteId}>
            Site {siteId}
          </option>
        ))}
      </select>
    </div>
  );
}