// ================================
// 🌍 TRANSLATION: Users Page
// Namespace: pages.users.*
// ================================

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Mail, Search, Users as UsersIcon, Loader2 } from "lucide-react";
import {
  listUsers as listUsersApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  type User as ApiUser,
} from "@/services/users.service";
import { useToast } from "@/hooks/use-toast";

type UserStatus = "active" | "inactive";

export type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  status: UserStatus;
};

type TabKey = "all" | "active" | "inactive";

const PAGE_SIZE = 8;

/** Map a backend user object to the local UI shape */
function toUiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.user_id,
    name: apiUser.full_name,
    email: apiUser.email,
    username: apiUser.username,
    role: apiUser.role ?? "—",
    status: apiUser.is_active ? "active" : "inactive",
  };
}

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  activeTab: TabKey;
  onTabChange: (value: TabKey) => void;
  counts: {
    all: number;
    active: number;
    inactive: number;
  };
  availableRoles: string[];
}

interface UsersTableProps {
  users: User[];
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: number, status: UserStatus) => void;
   selectedUserIds: number[];
   onToggleSelectUser: (id: number) => void;
   onToggleSelectAll: (selectAll: boolean) => void;
   onUserClick: (user: User) => void;
}

const UsersFilters = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  activeTab,
  onTabChange,
  counts,
  availableRoles,
}: UsersFiltersProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={t("pages.users.search.placeholder")}
              className="pl-9"
            />
          </div>

          <div className="w-full sm:w-56">
            <Select
              value={selectedRole}
              onValueChange={(value) => onRoleChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("pages.users.filters.rolePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("pages.users.filters.allRoles")}
                </SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button className="w-full gap-2 sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Mail className="h-4 w-4" />
            {t("pages.users.actions.sendInvitation")}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            {t("pages.users.actions.manageRoles")}
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as TabKey)}
        >
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <span>{t("pages.users.tabs.all")}</span>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <span>{t("pages.users.tabs.active")}</span>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                {counts.active}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              <span>{t("pages.users.tabs.inactive")}</span>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-xs">
                {counts.inactive}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            {t("pages.users.summary.total", { count: String(counts.all) })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const UsersTable = ({
  users,
  page,
  total,
  pageSize,
  onPageChange,
  onToggleStatus,
  selectedUserIds,
  onToggleSelectUser,
  onToggleSelectAll,
  onUserClick,
}: UsersTableProps) => {
  const { t } = useLanguage();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = total === 0 ? 0 : Math.min(page * pageSize, total);

  const handleChangePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    onPageChange(nextPage);
  };

  const allSelectedOnPage = users.length > 0 && users.every((user) => selectedUserIds.includes(user.id));

  return (
    <motion.div
      className="bg-card border border-border rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="hidden w-full sm:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary accent-primary"
                  aria-label={t("pages.users.table.selectAll")}
                  checked={allSelectedOnPage}
                  onChange={(event) => onToggleSelectAll(event.target.checked)}
                />
              </TableHead>
              <TableHead className="w-14">
                {t("pages.users.table.no")}
              </TableHead>
              <TableHead>{t("pages.users.table.user")}</TableHead>
              <TableHead>{t("pages.users.table.username")}</TableHead>
              <TableHead>{t("pages.users.table.email")}</TableHead>
              <TableHead>{t("pages.users.table.role")}</TableHead>
              <TableHead className="text-center">
                {t("pages.users.table.status")}
              </TableHead>
              <TableHead className="w-24 text-center">
                {t("pages.users.table.activate")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => {
              const isActive = user.status === "active";
              const initials = user.name
                .split(" ")
                .map((part) => part[0] ?? "")
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <TableRow
                  key={user.id}
                  className="hover:bg-secondary/30 cursor-pointer"
                  onClick={() => onUserClick(user)}
                >
                  <TableCell
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary accent-primary"
                      aria-label={`${t("pages.users.table.selectUser")} ${user.name}`}
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => onToggleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    @{user.username}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      variant={isActive ? "secondary" : "destructive"}
                    >
                      <span
                        className={
                          isActive
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {isActive
                          ? t("pages.users.status.active")
                          : t("pages.users.status.inactive")}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="w-24 text-center"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <div className="flex justify-center">
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) =>
                          onToggleStatus(user.id, checked ? "active" : "inactive")
                        }
                        aria-label={
                          isActive
                            ? `${t("pages.users.aria.deactivateUser")} ${user.name}`
                            : `${t("pages.users.aria.activateUser")} ${user.name}`
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-4 sm:hidden">
        {users.map((user) => {
          const isActive = user.status === "active";
          const initials = user.name
            .split(" ")
            .map((part) => part[0] ?? "")
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={user.id}
              className="rounded-2xl border border-border bg-card p-4 cursor-pointer"
              onClick={() => onUserClick(user)}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <Badge variant="secondary" className="rounded-full">
                  {user.role}
                </Badge>
                <Badge
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  variant={isActive ? "secondary" : "destructive"}
                >
                  <span
                    className={
                      isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {isActive
                      ? t("pages.users.status.active")
                      : t("pages.users.status.inactive")}
                  </span>
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    onToggleStatus(user.id, checked ? "active" : "inactive")
                  }
                  onClick={(event) => event.stopPropagation()}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground sm:flex-row">
        <span className="whitespace-nowrap">
          {t("pages.users.pagination.summary", { start: String(startIndex), end: String(endIndex), total: String(total) })}
        </span>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handleChangePage(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={(event) => {
                      event.preventDefault();
                      handleChangePage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handleChangePage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </motion.div>
  );
};

const Users = () => {
  const { t } = useLanguage();
  const { getAccessToken } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState<UserStatus>("active");
  const [confirmDeleteType, setConfirmDeleteType] = useState<"single" | "bulk" | null>(null);

  /* ---- Fetch users from backend ---- */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      if (!token) return;
      const data = await listUsersApi(token, 0, 100);
      setUsers(data.map(toUiUser));
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to load users",
      });
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      if (activeTab === "active" && user.status !== "active") return false;
      if (activeTab === "inactive" && user.status !== "inactive") return false;

      if (selectedRole !== "all" && user.role !== selectedRole) {
        return false;
      }

      if (!term) return true;

      const nameMatch = user.name.toLowerCase().includes(term);
      const emailMatch = user.email.toLowerCase().includes(term);

      return nameMatch || emailMatch;
    });
  }, [users, searchTerm, selectedRole, activeTab]);

  const counts = useMemo(
    () => ({
      all: users.length,
      active: users.filter((user) => user.status === "active").length,
      inactive: users.filter((user) => user.status === "inactive").length,
    }),
    [users],
  );

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(start, end);

  const availableRoles = useMemo(
    () =>
      Array.from(new Set(users.map((user) => user.role))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [users],
  );

  const handleToggleStatus = async (id: number, status: UserStatus) => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      await updateUserApi(token, id, { is_active: status === "active" });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, status } : user,
        ),
      );
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update status",
      });
    }
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleToggleSelectUser = (id: number) => {
    setSelectedUserIds((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      const idsOnPage = paginatedUsers.map((user) => user.id);
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...idsOnPage])));
    } else {
      const idsOnPageSet = new Set(paginatedUsers.map((user) => user.id));
      setSelectedUserIds((prev) => prev.filter((id) => !idsOnPageSet.has(id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUserIds.length === 0) return;
    try {
      const token = await getAccessToken();
      if (!token) return;
      await Promise.all(selectedUserIds.map((id) => deleteUserApi(token, id)));
      setUsers((prev) => prev.filter((user) => !selectedUserIds.includes(user.id)));
      setSelectedUserIds([]);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete users",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteType === "bulk") {
      await handleDeleteSelected();
    } else if (confirmDeleteType === "single") {
      await handleDeleteCurrentUser();
    }
    setConfirmDeleteType(null);
    setIsDetailsOpen(false);
    setEditingUserId(null);
  };

  const handleOpenUserDetails = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setIsDetailsOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsDetailsOpen(open);
    if (!open) {
      setEditingUserId(null);
    }
  };

  const handleSaveUserDetails = async () => {
    if (editingUserId == null) return;
    try {
      const token = await getAccessToken();
      if (!token) return;
      await updateUserApi(token, editingUserId, {
        username: editUsername,
        email: editEmail,
        is_active: editStatus === "active",
      });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                name: editName,
                username: editUsername,
                email: editEmail,
                role: editRole,
                status: editStatus,
              }
            : user,
        ),
      );
      setIsDetailsOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save user",
      });
    }
  };

  const handleDeleteCurrentUser = async () => {
    if (editingUserId == null) return;
    try {
      const token = await getAccessToken();
      if (!token) return;
      await deleteUserApi(token, editingUserId);
      setUsers((prev) => prev.filter((user) => user.id !== editingUserId));
      setSelectedUserIds((prev) => prev.filter((id) => id !== editingUserId));
      setIsDetailsOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete user",
      });
    }
  };

  return (
    <>
    <Sheet open={isDetailsOpen} onOpenChange={handleSheetOpenChange}>
      <DashboardLayout
        title={t("pages.users.title")}
        subtitle={t("pages.users.subtitle")}
      >
        <div className="mx-auto max-w-6xl">
          <UsersFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={counts}
            availableRoles={availableRoles}
          />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
          <>
          {selectedUserIds.length > 0 && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm">
              <span className="text-muted-foreground">
                {selectedUserIds.length} {t("pages.users.bulk.selectedLabel")}
              </span>
              <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteType("bulk")}>
                {t("pages.users.bulk.delete")}
              </Button>
            </div>
          )}

          <UsersTable
            users={paginatedUsers}
            page={currentPage}
            total={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onToggleStatus={handleToggleStatus}
            selectedUserIds={selectedUserIds}
            onToggleSelectUser={handleToggleSelectUser}
            onToggleSelectAll={handleToggleSelectAll}
            onUserClick={handleOpenUserDetails}
          />
          </>
          )}
        </div>
      </DashboardLayout>

      {editingUserId != null && (
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t("pages.users.details.title")}</SheetTitle>
            <SheetDescription>{t("pages.users.details.description")}</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="user-name">{t("pages.users.details.name")}</Label>
              <Input
                id="user-name"
                value={editName}
                disabled
                className="opacity-70 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-username">{t("pages.users.details.username")}</Label>
              <Input
                id="user-username"
                value={editUsername}
                onChange={(event) => setEditUsername(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-email">{t("pages.users.details.email")}</Label>
              <Input
                id="user-email"
                type="email"
                value={editEmail}
                onChange={(event) => setEditEmail(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-role">{t("pages.users.details.role")}</Label>
              <Input
                id="user-role"
                value={editRole}
                onChange={(event) => setEditRole(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>{t("pages.users.details.status")}</Label>
              <Select
                value={editStatus}
                onValueChange={(value) => setEditStatus(value as UserStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    {t("pages.users.status.active")}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {t("pages.users.status.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              {t("pages.users.details.actions.cancel")}
            </Button>
            <Button onClick={handleSaveUserDetails}>
              {t("pages.users.details.actions.save")}
            </Button>
          </SheetFooter>

          <div className="mt-6 border-t border-border pt-4">
            <p className="mb-2 text-sm font-medium text-destructive">
              {t("pages.users.details.dangerTitle")}
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setConfirmDeleteType("single")}
            >
              {t("pages.users.details.actions.delete")}
            </Button>
          </div>
        </SheetContent>
      )}
    </Sheet>

    <AlertDialog open={confirmDeleteType !== null} onOpenChange={(open) => { if (!open) { setConfirmDeleteType(null); } }}>
      <AlertDialogContent className="z-[200]">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("pages.users.confirm.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDeleteType === "bulk"
              ? t("pages.users.confirm.bulkDescription", { count: String(selectedUserIds.length) })
              : t("pages.users.confirm.singleDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("pages.users.confirm.no")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {t("pages.users.confirm.yes")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default Users;

