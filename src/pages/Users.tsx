// ================================
// 🌍 TRANSLATION: Users Page
// Namespace: pages.users.*
// ================================

import { useMemo, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Search, Users as UsersIcon } from "lucide-react";

type UserStatus = "active" | "inactive";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
};

type TabKey = "all" | "active" | "inactive";

const PAGE_SIZE = 8;

const initialUsers: User[] = [
  {
    id: 1,
    name: "Mr. Laverne Cole",
    email: "Stephany83@yahoo.com",
    role: "Creative",
    status: "active",
  },
  {
    id: 2,
    name: "Irvin Gusikowski",
    email: "Salvador98@yahoo.com",
    role: "Markets",
    status: "active",
  },
  {
    id: 3,
    name: "Ignacio Jerde PhD",
    email: "Baron_Dickinson@yahoo.com",
    role: "Intranet",
    status: "inactive",
  },
  {
    id: 4,
    name: "Lucio Walter",
    email: "Roberto.Zieme@gmail.com",
    role: "Optimization",
    status: "active",
  },
  {
    id: 5,
    name: "Dr. Donnie Bernier",
    email: "Mary81@hotmail.com",
    role: "Response",
    status: "active",
  },
  {
    id: 6,
    name: "Mark Robel II",
    email: "Gregoria53@yahoo.com",
    role: "Integration",
    status: "active",
  },
  {
    id: 7,
    name: "Jean McDermott",
    email: "Forest77@gmail.com",
    role: "Solutions",
    status: "inactive",
  },
  {
    id: 8,
    name: "Cindy Buckeridge",
    email: "Era.Bruen@hotmail.com",
    role: "Accounts",
    status: "active",
  },
  {
    id: 9,
    name: "Samantha Page",
    email: "Jeromy.Braun97@hotmail.com",
    role: "Identity",
    status: "active",
  },
  {
    id: 10,
    name: "Melaine Ernard",
    email: "Frederic77@gmail.com",
    role: "Mobility",
    status: "active",
  },
];

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
            {t("pages.users.summary.total")} {counts.all}
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
                        <span className="text-xs text-muted-foreground">
                          {user.role}
                        </span>
                      </div>
                    </div>
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
        <span>
          {t("pages.users.pagination.summary")} {startIndex}–{endIndex} / {total}
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

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState<UserStatus>("active");

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

  const handleToggleStatus = (id: number, status: UserStatus) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status,
            }
          : user,
      ),
    );
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

  const handleDeleteSelected = () => {
    if (selectedUserIds.length === 0) return;
    setUsers((prev) => prev.filter((user) => !selectedUserIds.includes(user.id)));
    setSelectedUserIds([]);
  };

  const handleOpenUserDetails = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
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

  const handleSaveUserDetails = () => {
    if (editingUserId == null) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUserId
          ? {
              ...user,
              name: editName,
              email: editEmail,
              role: editRole,
              status: editStatus,
            }
          : user,
      ),
    );
    setIsDetailsOpen(false);
  };

  const handleDeleteCurrentUser = () => {
    if (editingUserId == null) return;

    setUsers((prev) => prev.filter((user) => user.id !== editingUserId));
    setSelectedUserIds((prev) => prev.filter((id) => id !== editingUserId));
    setIsDetailsOpen(false);
  };

  return (
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

          {selectedUserIds.length > 0 && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2 text-sm">
              <span className="text-muted-foreground">
                {selectedUserIds.length} {t("pages.users.bulk.selectedLabel")}
              </span>
              <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
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
                onChange={(event) => setEditName(event.target.value)}
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
              onClick={handleDeleteCurrentUser}
            >
              {t("pages.users.details.actions.delete")}
            </Button>
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default Users;

